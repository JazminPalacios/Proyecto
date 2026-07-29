-- =====================================================================
-- seed_catalogo.sql
-- Carga el catálogo real (cafés + equipos + categorías) tomado del
-- sitio público (app.js) en las tablas del schema cafetero.
-- Pegar completo en el SQL Editor de Supabase y ejecutar.
-- Idempotente: no duplica si se corre de nuevo.
-- =====================================================================

-- ------------------------------------------------------------------
-- 1) Categorías (derivadas de las etiquetas de café y tipos de equipo)
-- ------------------------------------------------------------------
insert into cafetero.categorias (nombre, tipo) values
  ('Clásico', 'CAFE'),
  ('Suave',   'CAFE'),
  ('Cremoso', 'CAFE'),
  ('Dulce',   'CAFE'),
  ('Intenso', 'CAFE'),
  ('Sin café','CAFE'),
  ('Frío',    'CAFE'),
  ('Premium', 'CAFE'),
  ('Cafeteras',  'EQUIPO'),
  ('Accesorios', 'EQUIPO')
on conflict (tipo, nombre) do nothing;

-- ------------------------------------------------------------------
-- 2) Cafés  (categoria_id se resuelve por la etiqueta)
-- ------------------------------------------------------------------
insert into cafetero.cafes (nombre, descripcion, precio, imagen, categoria_id, disponible)
select
  v.nombre, v.descripcion, v.precio, v.imagen,
  (select id from cafetero.categorias where tipo = 'CAFE' and nombre = v.tag),
  true
from (values
  ('Espresso',             'Shot intenso y aromático, corazón de todo buen café.',        12000, 'https://images.pexels.com/photos/18604200/pexels-photo-18604200.jpeg?auto=compress&cs=tinysrgb&w=900', 'Clásico'),
  ('Americano',            'Espresso alargado con agua caliente, equilibrado y ligero.',  15000, 'https://images.pexels.com/photos/12039010/pexels-photo-12039010.jpeg?auto=compress&cs=tinysrgb&w=900', 'Suave'),
  ('Capuccino',            'Espresso, leche vaporizada y una nube de espuma sedosa.',      22000, 'https://images.pexels.com/photos/997670/pexels-photo-997670.jpeg?auto=compress&cs=tinysrgb&w=900',   'Cremoso'),
  ('Latte',                'Mucha leche cremosa sobre un espresso delicado.',             24000, 'https://images.pexels.com/photos/459489/pexels-photo-459489.jpeg?auto=compress&cs=tinysrgb&w=900',   'Suave'),
  ('Mocaccino',            'Café, chocolate y leche: el abrazo perfecto.',                26000, 'https://images.pexels.com/photos/8058120/pexels-photo-8058120.jpeg?auto=compress&cs=tinysrgb&w=900', 'Dulce'),
  ('Flat White',           'Doble ristretto con microespuma aterciopelada.',              23000, 'https://images.pexels.com/photos/32938771/pexels-photo-32938771.jpeg?auto=compress&cs=tinysrgb&w=900','Intenso'),
  ('Macchiato',            'Espresso ''manchado'' con un toque de espuma.',               18000, 'https://images.pexels.com/photos/11160148/pexels-photo-11160148.jpeg?auto=compress&cs=tinysrgb&w=900','Clásico'),
  ('Chocolate Caliente',   'Chocolate fundido y leche, para consentirte.',                25000, 'https://images.pexels.com/photos/16607248/pexels-photo-16607248.jpeg?auto=compress&cs=tinysrgb&w=900','Dulce'),
  ('Té',                   'Selección de infusiones y tés de hoja entera.',               14000, 'https://images.pexels.com/photos/6448532/pexels-photo-6448532.jpeg?auto=compress&cs=tinysrgb&w=900', 'Sin café'),
  ('Frappé',               'Café helado batido, cremoso y refrescante.',                  28000, 'https://images.pexels.com/photos/12166771/pexels-photo-12166771.jpeg?auto=compress&cs=tinysrgb&w=900','Frío'),
  ('Cold Brew',            'Extracción en frío por 18 horas, suave y dulce.',             27000, 'https://images.pexels.com/photos/1078773/pexels-photo-1078773.jpeg?auto=compress&cs=tinysrgb&w=900', 'Frío'),
  ('Café de Especialidad', 'Grano de origen único, tostado y servido con arte.',          32000, 'https://images.pexels.com/photos/19873648/pexels-photo-19873648.jpeg?auto=compress&cs=tinysrgb&w=900','Premium')
) as v(nombre, descripcion, precio, imagen, tag)
where not exists (
  select 1 from cafetero.cafes c where c.nombre = v.nombre
);

-- ------------------------------------------------------------------
-- 3) Equipos  (categoria_id se resuelve por el tipo)
-- ------------------------------------------------------------------
insert into cafetero.equipos (nombre, descripcion, precio, imagen, categoria_id, disponible)
select
  v.nombre, v.descripcion, v.precio, v.imagen,
  (select id from cafetero.categorias where tipo = 'EQUIPO' and nombre = v.cat),
  true
from (values
  ('Cafetera Italiana',   'Moka clásica para un espresso casero con carácter.',       180000,  'https://images.pexels.com/photos/28613082/pexels-photo-28613082.jpeg?auto=compress&cs=tinysrgb&w=900', 'Cafeteras'),
  ('Cafetera Francesa',   'Prensa de émbolo para un cuerpo redondo y aromático.',     210000,  'https://images.pexels.com/photos/34566502/pexels-photo-34566502.jpeg?auto=compress&cs=tinysrgb&w=900', 'Cafeteras'),
  ('Cafetera de Goteo',   'Preparación automática por goteo, ideal para la familia.', 250000,  'https://images.pexels.com/photos/8937271/pexels-photo-8937271.jpeg?auto=compress&cs=tinysrgb&w=900',  'Cafeteras'),
  ('Cafetera Espresso',   'Bomba de 15 bares para espresso de nivel barista.',        1450000, 'https://images.pexels.com/photos/6032797/pexels-photo-6032797.jpeg?auto=compress&cs=tinysrgb&w=900',  'Cafeteras'),
  ('Cafetera Automática', 'Del grano a la taza con solo un botón.',                   2900000, 'https://images.pexels.com/photos/2566027/pexels-photo-2566027.jpeg?auto=compress&cs=tinysrgb&w=900',  'Cafeteras'),
  ('Molinillo',           'Molienda uniforme para liberar todo el aroma.',            320000,  'https://images.pexels.com/photos/2972365/pexels-photo-2972365.jpeg?auto=compress&cs=tinysrgb&w=900',  'Accesorios'),
  ('Set de Tazas',        'Tazas de cerámica que conservan el calor.',                95000,   'https://images.pexels.com/photos/6312194/pexels-photo-6312194.jpeg?auto=compress&cs=tinysrgb&w=900',  'Accesorios'),
  ('Termo',               'Lleva tu café caliente a donde vayas.',                    140000,  'https://images.pexels.com/photos/7734743/pexels-photo-7734743.jpeg?auto=compress&cs=tinysrgb&w=900',  'Accesorios'),
  ('Filtros',             'Filtros de papel para una taza limpia y clara.',           35000,   'https://images.pexels.com/photos/34566499/pexels-photo-34566499.jpeg?auto=compress&cs=tinysrgb&w=900', 'Accesorios'),
  ('Prensa Francesa',     'Émbolo de acero inoxidable, resistente y elegante.',       210000,  'https://images.pexels.com/photos/13935593/pexels-photo-13935593.jpeg?auto=compress&cs=tinysrgb&w=900', 'Accesorios'),
  ('Jarra para Leche',    'Pitcher de acero para texturizar y hacer latte art.',      85000,   'https://images.pexels.com/photos/13882006/pexels-photo-13882006.jpeg?auto=compress&cs=tinysrgb&w=900', 'Accesorios'),
  ('Tamper',              'Prensa el café con presión pareja y precisa.',             120000,  'https://images.pexels.com/photos/4349794/pexels-photo-4349794.jpeg?auto=compress&cs=tinysrgb&w=900',  'Accesorios'),
  ('Balanza para Café',   'Precisión al gramo para recetas perfectas.',               180000,  'https://images.pexels.com/photos/34492952/pexels-photo-34492952.jpeg?auto=compress&cs=tinysrgb&w=900', 'Accesorios')
) as v(nombre, descripcion, precio, imagen, cat)
where not exists (
  select 1 from cafetero.equipos e where e.nombre = v.nombre
);

-- ------------------------------------------------------------------
-- 4) Verificación
-- ------------------------------------------------------------------
select 'categorias' as tabla, count(*) from cafetero.categorias
union all select 'cafes',   count(*) from cafetero.cafes
union all select 'equipos', count(*) from cafetero.equipos;
