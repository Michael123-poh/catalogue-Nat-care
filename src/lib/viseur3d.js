import {
  DataTexture,
  LatheGeometry,
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  OrthographicCamera,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  UnsignedByteType,
  Vector2,
  Vector4,
  WebGLRenderer,
} from 'three'

// Les photos ne sont pas éclairées par three.js : elles ont déjà leur lumière. On ajoute seulement
// ce qui donne du relief quand l'objet tourne : un léger éclairage, un assombrissement sur les
// bords (le pot "tourne" vers l'arrière) et un reflet doux.
const VERTEX = /* glsl */ `
  varying vec3 vPos;
  varying vec3 vNormal;

  void main() {
    vPos = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const FRAGMENT = /* glsl */ `
  uniform sampler2D uTex0;
  uniform sampler2D uTex1;
  uniform sampler2D uTex2;
  uniform vec4 uUv0;
  uniform vec4 uUv1;
  uniform vec4 uUv2;
  uniform float uNb;
  uniform vec3 uGeo; // axe X, largeur, hauteur de la photo phare

  varying vec3 vPos;
  varying vec3 vNormal;

  const float PI = 3.14159265359;

  // Photo plaquée "à plat" depuis la direction a : x = abscisse vue depuis cette direction
  vec4 face(sampler2D tex, vec4 m, float a, float phi, float r, float y) {
    float x = r * sin(phi - a);
    vec2 uv0 = vec2((uGeo.x + x) / uGeo.y, 0.5 + y / uGeo.z);
    return texture2D(tex, vec2(uv0.x * m.x + m.y, uv0.y * m.z + m.w));
  }

  // Poids d'un secteur : 1 dans son secteur, fondu sur les bords pour adoucir les raccords
  float poids(float a, float phi, float demi) {
    float d = abs(mod(phi - a + PI, 2.0 * PI) - PI);
    return 1.0 - smoothstep(demi - 0.15, demi + 0.15, d);
  }

  void main() {
    float r = length(vPos.xz);
    float phi = atan(vPos.x, vPos.z);
    float secteur = 2.0 * PI / uNb;
    float demi = secteur * 0.5;

    vec4 c0 = face(uTex0, uUv0, 0.0, phi, r, vPos.y);
    vec4 c1 = face(uTex1, uUv1, secteur, phi, r, vPos.y);
    vec4 c2 = uNb > 2.5 ? face(uTex2, uUv2, 2.0 * secteur, phi, r, vPos.y) : vec4(0.0);

    float w0 = poids(0.0, phi, demi);
    float w1 = poids(secteur, phi, demi);
    float w2 = uNb > 2.5 ? poids(2.0 * secteur, phi, demi) : 0.0;

    // Une photo transparente à cet endroit (hors de son contour) ne compte pas dans le mélange :
    // sinon elle éclaircirait et rendrait translucide la photo voisine
    float s0 = w0 * smoothstep(0.05, 0.4, c0.a);
    float s1 = w1 * smoothstep(0.05, 0.4, c1.a);
    float s2 = w2 * smoothstep(0.05, 0.4, c2.a);
    float total = s0 + s1 + s2;
    float alpha = total > 0.001 ? (c0.a * s0 + c1.a * s1 + c2.a * s2) / total : 0.0;
    float poidsCouleur = max(c0.a * s0 + c1.a * s1 + c2.a * s2, 0.0001);
    vec3 col = (c0.rgb * c0.a * s0 + c1.rgb * c1.a * s1 + c2.rgb * c2.a * s2) / poidsCouleur;

    vec3 n = normalize(vNormal);
    vec3 lumiere = normalize(vec3(-0.35, 0.55, 0.75));
    float diffus = max(dot(n, lumiere), 0.0);
    float bord = pow(1.0 - clamp(n.z, 0.0, 1.0), 2.5);
    float reflet = pow(max(dot(n, normalize(lumiere + vec3(0.0, 0.0, 1.0))), 0.0), 36.0) * 0.1;

    float ombre = (0.82 + 0.28 * diffus) * (1.0 - 0.4 * bord);
    col = col * ombre + reflet * alpha;

    gl_FragColor = vec4(col * alpha, alpha);
  }
`

const SEGMENTS = 128
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function creerTexture(face, anisotropie) {
  const texture = new DataTexture(face.donnees, face.w, face.h, RGBAFormat, UnsignedByteType)
  texture.generateMipmaps = true
  texture.minFilter = LinearMipmapLinearFilter
  texture.magFilter = LinearFilter
  texture.anisotropy = anisotropie
  texture.needsUpdate = true
  return texture
}

export class Viseur3D {
  constructor(canvas, modele) {
    const { largeur, hauteur, axeX, profil, faces } = modele
    this.canvas = canvas
    this.nbFaces = faces.length
    this.angle = 0
    this.tween = 0

    this.renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
    this.renderer.setClearColor(0x000000, 0)
    this.scene = new Scene()

    // Caméra orthographique : à angle 0 le rendu se superpose exactement à la photo. Une caméra en
    // perspective agrandirait le devant du pot (d'environ 8 %) par rapport à son contour et
    // décalerait les bords de l'étiquette.
    this.camera = new OrthographicCamera(-largeur / 2, largeur / 2, hauteur / 2, -hauteur / 2, 1, 4 * largeur)
    this.camera.position.set(0, 0, 2 * largeur)

    const anisotropie = Math.min(8, this.renderer.capabilities.getMaxAnisotropy())
    this.textures = faces.map((face) => creerTexture(face, anisotropie))
    const texture = (i) => this.textures[Math.min(i, this.textures.length - 1)]
    const uv = (i) => new Vector4(...faces[Math.min(i, faces.length - 1)].uv)

    this.materiau = new ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      premultipliedAlpha: true,
      uniforms: {
        uTex0: { value: texture(0) },
        uTex1: { value: texture(1) },
        uTex2: { value: texture(2) },
        uUv0: { value: uv(0) },
        uUv1: { value: uv(1) },
        uUv2: { value: uv(2) },
        uNb: { value: this.nbFaces },
        uGeo: { value: [axeX, largeur, hauteur] },
      },
    })

    this.geometrie = new LatheGeometry(
      profil.map(([r, y]) => new Vector2(r, y)),
      SEGMENTS,
    )
    this.mesh = new Mesh(this.geometrie, this.materiau)
    this.mesh.position.x = axeX - largeur / 2
    this.scene.add(this.mesh)

    this.observateur = new ResizeObserver(() => this.redimensionner())
    this.observateur.observe(canvas)
    this.redimensionner()
  }

  redimensionner() {
    const largeur = this.canvas.clientWidth
    const hauteur = this.canvas.clientHeight
    if (!largeur || !hauteur) return
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    this.renderer.setSize(largeur, hauteur, false)
    this.dessiner()
  }

  dessiner() {
    this.mesh.rotation.y = this.angle
    this.renderer.render(this.scene, this.camera)
  }

  // Angle de rotation en radians (0 = face du produit phare). Une valeur négative fait défiler
  // les faces dans l'ordre : phare, 2e photo, 3e photo…
  definirAngle(angle) {
    this.angle = angle
    this.dessiner()
  }

  // Tourne en douceur pour montrer la face d'index donné (= miniature choisie)
  tournerVers(index, duree = 900) {
    const cible = -(index * 2 * Math.PI) / this.nbFaces
    const tour = 2 * Math.PI
    const arrivee = cible + tour * Math.round((this.angle - cible) / tour)
    const depart = this.angle
    if (Math.abs(arrivee - depart) < 1e-4) return

    cancelAnimationFrame(this.tween)
    const debut = performance.now()
    const pas = (maintenant) => {
      const t = Math.min(1, (maintenant - debut) / duree)
      this.definirAngle(depart + (arrivee - depart) * easeInOut(t))
      if (t < 1) this.tween = requestAnimationFrame(pas)
    }
    this.tween = requestAnimationFrame(pas)
  }

  dispose() {
    cancelAnimationFrame(this.tween)
    this.observateur.disconnect()
    this.geometrie.dispose()
    this.materiau.dispose()
    this.textures.forEach((texture) => texture.dispose())
    this.renderer.dispose()
  }
}
