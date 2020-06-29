=== pagoUno Gateway for WooCommerce ===
Contributors: entradauno
Tags: ecommerce, pagoUno, woocommerce
Requires at least: 4.9.10
Tested up to: 5.4
Requires PHP: 5.6
Stable tag: 4.2.1
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Plugin de integración de pagoUno para WooCommerce

Ofrezca a sus clientes la posibilidad de realizar pagos con tarjeta por medio de pagoUno como método de pago.

== Description ==

pagoUno es el sistema de recaudación más robusto y confiable de la industria con el precio más bajo del mercado. 

Nuestro complemento oficial de WooCommerce le permite agregar una vía de pago en su sitio web.

= ¿Por qué elegir pagoUno? =

PagoUno brinda todas las herramientas necesarias de la manera más simple y segura para que puedas gestionar tus cobranzas y administrar tus ingresos. Rrespeta tu marca e identidad corporativa y nunca muestra su logo a la hora de transaccionar, es tu socio tecnológico y no tu intermediario.

PagoUno pone a tu servicio toda la tecnología de mayor calidad a nivel mundial para poder afrontar las exigencias que la industria del e-commerce requiere en la actualidad.

= Main Functionalities of pagoUno =
* Webhook online and in real time;
* High approval rates thanks to a robust fraud analysis;
* PCI Compliance;
* Accept the payment methods everyone prefers;
* Installment payments;

= Compatibilidad =

- WooCommerce 3.0 o superior.

== Frequently Asked Questions ==

== Instalación ==

= Minimum Technical Requirements =
* WordPress version
* Compatibility and dependency of WooCommerce VXX 
* LAMP Environment (Linux, Apache, MySQL, PHP)
* SSL Certificate
* Additional configuration: safe_mode off, memory_limit higher than 256MB

1. Descargue el [zip] (https://github.com/pagouno/woocommerce-pagouno-plugin/archive/master.zip) ahora o desde el o WordPress Module [Directory] (https://br.wordpress.org/plugins / woocommerce-pagouno /)
2. Copiar carpeta woocommerce-pagouno-plugin-master al directorio de plugins de wordpress ("raíz de wordpress"/wp-content/plugins). 
3. Renombrarla woocommerce-pagouno-plugin-master por woocommerce-pagouno.

== Configuración ==

####Activación
La activación se realiza como cualquier plugin de Wordpress: Desde Plugins -> Plugins instalados -> activar el plugin de nombre <strong>pagoUno</strong>.<br />

####Configuración plug in

Para llegar al menú de configuración del plugin ir a: WooCommerce Ajustes -> Pagos

####Obtener datos de configuración

1. Cree una cuenta de vendedor de pagoUno si aún no tienes una.
2. Obtenga sus credenciales (clave privada y pública).
3. Establezca las preferencias de pago y realice otras configuraciones avanzadas para cambiar las opciones predeterminadas.
4. Ahora está listo para producción y recibir pagos reales.

#### Activar/Desactivar

Premite habilitar o no el plugin

#### Validacion extra

Permite configurar el tipo de formulario que debera llenar el usuario con sus datos

== Formulario Estandar ==

1. Numero de tarjeta
2. Fecha de vencimiento
3. Nombre del titular
4. Codigo de seguridad
5. Tipo de documento
5. Numero (de documento)
6. Cantidad de cuotas
7. Email de contacto

== Formulario con validación extendida ==

1. Numero de tarjeta
2. Fecha de vencimiento
3. Nombre del titular
4. Codigo de seguridad
5. Tipo de documento
6. Numero (de documento)
7. Cantidad de cuotas
8. Email de contacto
9. Fecha de nacimiento
10. Numero de telefono (Opcional)
11. Pais
12. Provincia
13. Ciudad
14. Calle	
15. Altura

####Llave de acceso privada (Private key)

Llave de acceso privada que le concedera la entidad entradaUno

####Llave de acceso publica (Public Key)

Llave de acceso publica que le concedera la entidad de entradaUno

####Codigo de agrupador

Código que le concedera la entidad de entradaUno

####Habilitar las siguientes cuotas

Activa las cuotas que usted desee, las cuotas disponibles son:
1.a. 3 cuotas
1.b. 6 cuotas
1.c. 9 cuotas
1.d. 12 cuotas
1.e. 24 cuotas

2.a. Ahora 3
2.b. Ahora 6
2.c. Ahora 12
2.d. Ahora 18

####Coeficiente

1.a 3 cuotas -> Coeficiente que calcula el interes para 3 cuotas, ej: 1.2500, Importante: el valor 1 no agregara intereses, el valor 0 hara que el valor de su producto sea $0
1.b 6 cuotas -> Coeficiente que calcula el interes para 6 cuotas, ej: 1.2500, Importante: el valor 1 no agregara intereses, el valor 0 hara que el valor de su producto sea $0
1.c 9 cuotas -> Coeficiente que calcula el interes para 9 cuotas, ej: 1.2500, Importante: el valor 1 no agregara intereses, el valor 0 hara que el valor de su producto sea $0
1.d 12 cuotas -> Coeficiente que calcula el interes para 12 cuotas, ej: 1.2500, Importante: el valor 1 no agregara intereses, el valor 0 hara que el valor de su producto sea $0
1.e 24 cuotas -> Coeficiente que calcula el interes para 24 cuotas, ej: 1.2500, Importante: el valor 1 no agregara intereses, el valor 0 hara que el valor de su producto sea $0

2.a. Ahora 3 -> Coeficiente que calcula el interes para Ahora 3, ej: 1.2500, Importante: el valor 1 no agregara intereses, el valor 0 hara que el valor de su producto sea $0
2.b. Ahora 6 -> Coeficiente que calcula el interes para Ahora 6, ej: 1.2500, Importante: el valor 1 no agregara intereses, el valor 0 hara que el valor de su producto sea $0
2.c. Ahora 12 -> Coeficiente que calcula el interes para Ahora 12, ej: 1.2500, Importante: el valor 1 no agregara intereses, el valor 0 hara que el valor de su producto sea $0
2.d. Ahora 18 -> Coeficiente que calcula el interes para Ahora 18, ej: 1.2500, Importante: el valor 1 no agregara intereses, el valor 0 hara que el valor de su producto sea $0

####Observaciones

Si tiene activada una opción de cuota (Habilitar las siguientes cuotas), por ejemplo "3 Cuotas", si usted no tiene ningun valor para "Coeficiente para 3 Cutoas" el plugin no habilitara la opcion de pago de 3 cuotas.
Para guardar todos los cambios haga click en "Guardar los cambios" al pie de la pagina
