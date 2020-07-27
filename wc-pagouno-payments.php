<?php
session_start();
/**
 * Plugin Name:Payments for pagoUno on WooCommerce
 * Plugin URI: https://github.com/entradaUno/pagoUno-woocommerce
 * Description: Acepte pagos con tarjeta de credito y débito con el plugin de pagoUno en WooCommerce
 * Version: 1.0.2
 * Author: entradaUno
 * Author URI: https://soluciones.entradauno.com/
 * Text Domain: woocommerce-pagouno
 */

/*
 * function inicilizadora de la clase ==> pagouno_init_gateway_class
 * class ==> WC_PagoUno_Gateway
 *
*/
defined( 'ABSPATH' ) or exit;

//registro de la clase como un gateway de WooCommerce
add_filter( 'woocommerce_payment_gateways', 'pagouno_add_gateway_class' );
function pagouno_add_gateway_class( $gateways ) {
    $gateways[] = 'WC_PagoUno_Gateway';
    return $gateways;
}

//inicializacion de la clase
add_action( 'plugins_loaded', 'pagouno_init_gateway_class' );
function pagouno_init_gateway_class () {
    class WC_PagoUno_Gateway extends WC_Payment_Gateway {
        public function __construct() {

            $this->CALLBACK_URL = "pagouno-endpoint";

            $this->id = 'pagouno'; // ID del plugin
            $this->icon = ''; // icono o imagen a renderearse en la descripcion
            $this->has_fields = true; // true para indicar que tiene formulario
            $this->method_title = 'pagoUno';
            $this->method_description = 'Acepte pagos con tarjeta con pagoUno plugin en WooCommerce'; // se rendereara en la pagina de opciones

            //======================================================================================================
            // gateways can support subscriptions, refunds, saved payment methods,
            // but in this tutorial we begin with simple payments
            $this->supports = array(
                'products'
            );
            //======================================================================================================

            // metodo con todas los campos de opciones
            $this->init_form_fields();

            // carga de opciones
            $this->init_settings();
            $this->title = "pagoUno";
            $this->description = "Por favor complete el formulario con sus datos y los de su tarjeta";
            $this->enabled = $this->get_option( 'enabled' );
            $this->extended_form = $this->get_option( 'extended_form' );
            $this->private_key = $this->get_option( 'private_key' );
            $this->publishable_key =$this->get_option( 'publishable_key' );
            $this->merchant_code_group = $this->get_option( 'merchant_code_group' );

            $this->cuotas_habilitadas = $this->get_option( 'habilitar_cuotas' );
            $this->coef_3 = $this->get_option( 'coef_3' );
            $this->coef_6 = $this->get_option( 'coef_6' );
            $this->coef_9 = $this->get_option( 'coef_9' );
            $this->coef_12 = $this->get_option( 'coef_12' );
            $this->coef_24 = $this->get_option( 'coef_24' );
            $this->coef_a3 = $this->get_option( 'coef_a3' );
            $this->coef_a6 = $this->get_option( 'coef_a6' );
            $this->coef_a12 = $this->get_option( 'coef_a12' );
            $this->coef_a18 = $this->get_option( 'coef_a18' );

            // si hay cuotas activadas se calcula el coeficiente de las cuotas

            // guardar las configuraciones
            add_action( 'woocommerce_update_options_payment_gateways_' . $this->id, array( $this, 'process_admin_options' ) );

            // obtener el token por js
            add_action( 'wp_enqueue_scripts', array( $this, 'pagouno_scripts' ) );
            
        }
        public function init_form_fields() {

            $my_js_configuration_mask  = date("ymd-Gis", filemtime( plugin_dir_path( __FILE__ ) . '/assets/js/configuration-mask.js' ));
            wp_enqueue_script( 'configuration_mask_js', plugins_url( '/assets/js/configuration-mask.js', __FILE__ ), array('jquery'), $my_js_configuration_mask );

            $this->form_fields = array(
                'enabled' => array(
                    'title'       => 'Activar/Desactivar',
                    'label'       => 'Activar pagoUno gateway',
                    'type'        => 'checkbox',
                    'description' => 'Activar o desactivar el plugin de pagoUno',
                    'desc_tip'    => true,
                    'default'     => 'no'
                ),
                'extended_form' => array(
                    'title'       => 'Validación adicional',
                    'label'       => 'Activar la validación adicional',
                    'type'        => 'checkbox',
                    'description' => 'Activar o desactivar el formulario de pago extendido, donde se requerirán los datos completos del cliente al momento de hacer una transacción. Si deja esta opción deshabilitada solo se requerirán los datos indispensables al momento de hacer la transacción (datos de la tarjeta, email y tipo y numero de documento).',
                    'desc_tip'    => true,
                    'default'     => 'no',
                ),
                'private_key' => array(
                    'title'       => 'Llave de Acceso Privada (Private Key)',
                    'type'        => 'text'
                ),
                'publishable_key' => array(
                    'title'       => 'Llave de Acceso Publica (Public Key)',
                    'type'        => 'text'
                ),
                'merchant_code_group' => array(
                    'title'       => 'Código de Agrupador',
                    'type'        => 'text'
                ),
                'habilitar_cuotas' => array(
                    'title'             => 'Habilitar las Siguientes Cantidades de Cuotas',
                    'type'              => 'multiselect',
                    'class'             => 'wc-enhanced-select',
                    'default'           => 'no',
                    'description'       => 'Activar cuotas',
                    'options'           => array(
                        '3'  => '3 Cuotas',
                        '6'  => '6 Cuotas',
                        '9'  => '9 Cuotas',
                        '12' => '12 Cuotas',
                        '24' => '24 Cuotas',
                        '13' => 'Ahora 3',
                        '16' => 'Ahora 6',
                        '7'  => 'Ahora 12',
                        '8'  => 'Ahora 18',
                    ),
                    'desc_tip'          => true,
                    'custom_attributes' => array(
                        'data-placeholder' => 'Elegí que cantidades de cuotas ofrecer',
                    ),
                ),
                'coef_3' => array(
                    'title'       => 'Coeficiente para 3 Cutoas',
                    'type'        => 'text',
                    'placeholder' => 'En caso de no tener habilitado dejar en blanco',
                    'description' => 'Introducir coeficiente',
                    'desc_tip'    => true
                ),
                'coef_6' => array(
                    'title'       => 'Coeficiente para 6 Cutoas',
                    'type'        => 'text',
                    'placeholder' => 'En caso de no tener habilitado dejar en blanco',
                    'description' => 'Introducir coeficiente',
                    'desc_tip'    => true
                ),
                'coef_9' => array(
                    'title'       => 'Coeficiente para 9 Cutoas',
                    'type'        => 'text',
                    'placeholder' => 'En caso de no tener habilitado dejar en blanco',
                    'description' => 'Introducir coeficiente',
                    'desc_tip'    => true
                ),
                'coef_12' => array(
                    'title'       => 'Coeficiente para 12 Cutoas',
                    'type'        => 'text',
                    'placeholder' => 'En caso de no tener habilitado dejar en blanco',
                    'description' => 'Introducir coeficiente',
                    'desc_tip'    => true
                ),
                'coef_24' => array(
                    'title'       => 'Coeficiente para 24 Cutoas',
                    'type'        => 'text',
                    'placeholder' => 'En caso de no tener habilitado dejar en blanco',
                    'description' => 'Introducir coeficiente',
                    'desc_tip'    => true
                ),
                'coef_a3' => array(
                    'title'       => 'Coeficiente para Ahora 3',
                    'type'        => 'text',
                    'placeholder' => 'En caso de no tener habilitado dejar en blanco',
                    'description' => 'Introducir coeficiente',
                    'desc_tip'    => true
                ),
                'coef_a6' => array(
                    'title'       => 'Coeficiente para Ahora 6',
                    'type'        => 'text',
                    'placeholder' => 'En caso de no tener habilitado dejar en blanco',
                    'description' => 'Introducir coeficiente',
                    'desc_tip'    => true
                ),
                'coef_a12' => array(
                    'title'       => 'Coeficiente para Ahora 12',
                    'type'        => 'text',
                    'placeholder' => 'En caso de no tener habilitado dejar en blanco',
                    'description' => 'Introducir coeficiente',
                    'desc_tip'    => true
                ),
                'coef_a18' => array(
                    'title'       => 'Coeficiente para Ahora 18',
                    'type'        => 'text',
                    'placeholder' => 'En caso de no tener habilitado dejar en blanco',
                    'description' => 'Introducir coeficiente',
                    'desc_tip'    => true
                )
            );
            //agrega un hidden input al form de woocommerce, desde aca se toma el token
            add_action( 'woocommerce_after_checkout_billing_form', 'token_field' , 10, 1 );
            if ( !function_exists('token_field') ){
                function token_field ( $checkout ) {
                    echo '
                        <div>
                            <p class="form-row form-row-wide" id="pagouno_token_field">
                                <input type="hidden" class="input-text " name="pagouno_token" id="pagouno_token" value="">
                            </p>
                        </div>';
                }
            }
            //se guarda el token al enviar el form
            add_action( 'woocommerce_checkout_update_order_meta', 'save_pagouno_token' );
            if ( !function_exists('save_pagouno_token') ){
                function save_pagouno_token( $order_id ) {
                    if ( ! empty( $_POST['pagouno_token'] ) ) {
                        update_post_meta( $order_id, 'pagouno_token', sanitize_text_field( $_POST['pagouno_token'] ) );
                    }
                }
            }

            //agrega un hidden input al form de woocommerce, desde aca se toma la cantidad de cuotas
            add_action( 'woocommerce_after_checkout_billing_form', 'dues_field' , 10, 1 );
            if ( !function_exists('dues_field') ){
                function dues_field ( $checkout ) {
                    echo '
                        <div>
                            <p class="form-row form-row-wide" id="pagouno_dues_field">
                                <input type="hidden" class="input-text " name="pagouno_cuotas" id="pagouno_cuotas" value="">
                            </p>
                        </div>';
                }
            }
            //se guardan al enviar el form
            add_action( 'woocommerce_checkout_update_order_meta', 'save_pagouno_dues' );
            if ( !function_exists('save_pagouno_dues') ){
                function save_pagouno_dues( $order_id ) {
                    if ( ! empty( $_POST['pagouno_cuotas'] ) ) {
                        update_post_meta( $order_id, 'pagouno_cuotas', sanitize_text_field( $_POST['pagouno_cuotas'] ) );
                    }
                }
            }
            //agrega un hidden input al form de woocommerce, desde aca se toma el total con el calculo de coeficiente
            add_action( 'woocommerce_after_checkout_billing_form', 'total_field' , 10, 1 );
            if ( !function_exists('total_field') ){
                function total_field ( $checkout ) {
                    echo '
                        <div>
                            <p class="form-row form-row-wide" id="pagouno_total_field">
                                <input type="hidden" class="input-text " name="pagouno_hidden_total" id="pagouno_hidden_total" value="">
                            </p>
                        </div>';
                }
            }
            //se guardan al enviar el form
            add_action( 'woocommerce_checkout_update_order_meta', 'save_pagouno_total' );
            if ( !function_exists('save_pagouno_total') ){
                function save_pagouno_total( $order_id ) {
                    if ( ! empty( $_POST['pagouno_hidden_total'] ) ) {
                        update_post_meta( $order_id, 'pagouno_hidden_total', sanitize_text_field( $_POST['pagouno_hidden_total'] ) );
                    }
                }
            }
        }

        public function payment_fields() {

            // descripcion
            // I will echo() the form, but you can close PHP tags and print it directly in HTML
            echo '<fieldset id="wc-' . esc_attr( $this->id ) . '-cc-form" class="wc-credit-card-form wc-payment-form" style="background:transparent;">';

            // Add this action hook if you want your custom payment gateway to support it
            do_action( 'woocommerce_credit_card_form_start', $this->id );

            // Html con los input para los datos de la tarjeta
            if( $this->extended_form == "no" ) {
                echo '  <div class="form-row form-row-first">
                            <label>Numero de tarjeta <span id="pu_cc_type"></span><span class="required"> *<span id="puCcError" style="display: none;"> Incorrecto</span></span></label>
                            <input id="pagoUno_ccNo" type="text" autocomplete="off">
                        </div>
                        <div class="form-row form-row-last">
                            <label>Fecha de Vto. <span class="required">*<span id="puEpError" style="display: none;"> Incorrecto</span></span></label>
                            <input id="pagoUno_expdate" type="text" autocomplete="off">
                        </div>
                        <div class="form-row form-row-first">
                            <label>Nombre del Titular <span class="required">* <span id="puNameError" style="display: none;"> Incorrecto</span></span></label>
                            <input id="pagoUno_ccName" type="text" autocomplete="off">
                        </div>
                        <div class="form-row form-row-last">
                            <label>Cod. de Seguridad <span class="required">*<span id="puCvcError" style="display: none;"> Incorrecto</span></span></label>
                            <input id="pagoUno_cvc" type="text" autocomplete="off">
                        </div>
                        <div class="form-row form-row-first">
                            <label>Tipo de Documento <span class="required">*</span></label>
                            <select id="pagoUno_ccDocType" class="" name="select" style="width: 100%">
                                <option value="DNI" selected>DNI</option>
                                <option value="CUIL">CUIL</option>
                                <option value="OTRO">OTRO</option>
                            </select>
                        </div>
                        <div class="form-row form-row-last">
                            <label>Número <span class="required">*<span id="puDocNumError" style="display: none;"> Incorrecto</span></span></label>
                            <input id="pagoUno_ccDocNum" type="text" autocomplete="off">
                        </div>
                        <div class="form-row form-row-wide">
                            <label>Cantidad de Cuotas <span class="required">*</span></label>
                            <select id="pagoUno_dues" class="" name="select" style="width: 100%">
                            </select>
                        </div>
                        <div class="form-row form-row-wide">
                            <label>Email de Contacto <span class="required">*<span id="puEmailError" style="display: none;"> Incorrecto</span></span></label>
                            <input id="pagoUno_email" type="text" autocomplete="off">
                        </div>
                        <div class="clear"></div>';
            } else if ( $this->extended_form == "yes" ){
                echo '  <div class="form-row form-row-first">
                            <label>Numero de tarjeta <span id="pu_cc_type"></span><span class="required"> *<span id="puCcError" style="display: none;"> Incorrecto</span></span></label>
                            <input id="pagoUno_ccNo" type="text" autocomplete="off">
                        </div>
                        <div class="form-row form-row-last">
                            <label>Fecha de Vto. <span class="required">* <span id="puEpError" style="display: none;"> Incorrecto</span></span></label>
                            <input id="pagoUno_expdate" type="text" autocomplete="off">
                        </div>
                        <div class="form-row form-row-first">
                            <label>Nombre del Titular <span class="required">*<span id="puNameError" style="display: none;"> Incorrecto</span></span></label>
                            <input id="pagoUno_ccName" type="text" autocomplete="off">
                        </div>
                        <div class="form-row form-row-last">
                            <label>Cod. de Seguridad <span class="required">* <span id="puCvcError" style="display: none;"> Incorrecto</span></span></label>
                            <input id="pagoUno_cvc" type="text" autocomplete="off">
                        </div>
                        <div class="form-row form-row-first">
                            <label>Tipo de Documento <span class="required">*</span></label>
                            <select id="pagoUno_ccDocType" class="" name="select" style="width: 100%">
                                <option value="DNI" selected>DNI</option>
                                <option value="CUIL">CUIL</option>
                                <option value="OTRO">OTRO</option>
                            </select>
                        </div>
                        <div class="form-row form-row-last">
                            <label>Número <span class="required">*<span id="puDocNumError" style="display: none;"> Incorrecto</span></span></label>
                            <input id="pagoUno_ccDocNum" type="text" autocomplete="off">
                        </div>
                        <div class="form-row form-row-wide">
                            <label>Cantidad de Cuotas <span class="required">*</span></label>
                            <select id="pagoUno_dues" class="" name="select" style="width: 100%">
                            </select>
                        </div>
                        <div class="form-row form-row-wide">
                            <label>Email de Contacto <span class="required">*<span id="puEmailError" style="display: none;"> Ingrese una dirección de email válida</span></span></label>
                            <input id="pagoUno_email" type="text" autocomplete="off">
                        </div>
                        <div class="form-row form-row-first">
                            <label>Fecha de Nacimiento <span class="required">*<span id="puBirthDateError" style="display: none;"> Incorrecto</span></label>
                            <input id="pagoUno_birthDate" type="text" autocomplete="off">
                        </div>
                        <div class="form-row form-row-last">
                            <label>Número de Telefono (Opcional)</label>
                            <input id="pagoUno_phone" type="text" autocomplete="off">
                        </div>
                        <div class="form-row form-row-wide">
                            <label>País <span class="required">*<span id="puCountryError" style="display: none;"> Ingrese un país válido</span></label>
                            <input id="pagoUno_country" type="text" autocomplete="off">
                        </div>
                        <div class="form-row form-row-first">
                            <label>Provincia <span class="required">*<span id="puStateError" style="display: none;"> Incorrecto</span></label>
                            <input id="pagoUno_state" type="text" autocomplete="off">
                        </div>
                        <div class="form-row form-row-last">
                            <label>Ciudad <span class="required">*<span id="puCityError" style="display: none;"> Incorrecto</span></label>
                            <input id="pagoUno_city" type="text" autocomplete="off">
                        </div>
                        <div class="form-row form-row-first">
                            <label>Calle <span class="required">*<span id="puStreetError" style="display: none;"> Incorrecto</span></label>
                            <input id="pagoUno_street" type="text" autocomplete="off">
                        </div>
                        <div class="form-row form-row-last">
                            <label>Altura <span class="required">*<span id="puStreetNumberError" style="display: none;"> Incorrecto</span></label>
                            <input id="pagoUno_streetNumber" type="text" autocomplete="off">
                        </div>
                        <div class="clear"></div>
                        ';
            }

            do_action( 'woocommerce_credit_card_form_end', $this->id );

            echo '<div class="clear"></div></fieldset>';

        }
        public function pagouno_scripts() {
            global $woocommerce;

            $total = $woocommerce->session->get('cart_totals')['total'];
            $total_shipping = $woocommerce->session->get('cart_totals')['shipping_total'];
            
            $this->$cuotas_arr = array();
            if( !empty( $this->cuotas_habilitadas ) && is_array( $this->cuotas_habilitadas ) ){
                global $woocommerce;
                $total_price = number_format( $total - $total_shipping , 2, '.', '');
                $price_formated = '';
                for ($i = 0; $i < count($this->cuotas_habilitadas); $i ++) {
                    switch ( $this->cuotas_habilitadas[$i] ) {
                        case 3:
                            if ( !empty($this->coef_3) && is_numeric($this->coef_3)) {
                                $price_formated = number_format( $total_price * $this->coef_3 , 2, '.', '');
                                array_push($this->$cuotas_arr, array (
                                    'cuotas' => 3,
                                    'isAhora' => false,
                                    'total'  => $price_formated,
                                    'cuota'  => number_format( $price_formated / 3 , 2, '.', '')
                                ));
                            } else {};
                            break;
                        case 6:
                            if ( !empty($this->coef_6) && is_numeric($this->coef_6)) {
                                $price_formated = number_format( $total_price * $this->coef_6 , 2, '.', '');
                                array_push($this->$cuotas_arr, array (
                                    'cuotas' => 6,
                                    'isAhora' => false,
                                    'total'  => $price_formated,
                                    'cuota'  => number_format( $price_formated / 6 , 2, '.', '')
                                ));
                            } else {};
                            break;
                        case 9:
                            if ( !empty($this->coef_9) && is_numeric($this->coef_9) ) {
                                $price_formated = number_format( $total_price * $this->coef_9 , 2, '.', '');
                                array_push($this->$cuotas_arr, array (
                                    'cuotas' => 9,
                                    'isAhora' => false,
                                    'total'  => $price_formated,
                                    'cuota'  => number_format( $price_formated / 9 , 2, '.', '')
                                ));
                            } else {};
                            break;
                        case 12:
                            if ( !empty($this->coef_12) && is_numeric($this->coef_12) ) {
                                $price_formated = number_format( $total_price * $this->coef_12, 2, '.', '');
                                array_push($this->$cuotas_arr, array (
                                    'cuotas' => 12,
                                    'isAhora' => false,
                                    'total'  => $price_formated,
                                    'cuota'  => number_format( $price_formated / 12 , 2, '.', '')
                                ));
                            } else {};
                            break;
                        case 24:
                            if ( !empty($this->coef_24) && is_numeric($this->coef_24) ) {
                                $price_formated = number_format( $total_price * $this->coef_24 , 2, '.', '');
                                array_push($this->$cuotas_arr, array (
                                    'cuotas' => 24,
                                    'isAhora' => false,
                                    'total'  => $price_formated,
                                    'cuota'  => number_format( $price_formated / 24 , 2, '.', '')
                                ));
                            } else {};
                            break;
                        case 13:
                            if ( !empty($this->coef_a3) && is_numeric($this->coef_a3) ) {
                                $price_formated = number_format( $total_price * $this->coef_a3 , 2, '.', '');
                                array_push($this->$cuotas_arr, array (
                                    'cuotas'  => 13,
                                    'isAhora' => true,
                                    'total'   => $price_formated,
                                    'cuota'   => number_format( $price_formated / 3 , 2, '.', '')
                                ));
                            } else {};
                            break;
                        case 16:
                            if ( !empty($this->coef_a6) && is_numeric($this->coef_a6) ) {
                                $price_formated = number_format( $total_price * $this->coef_a6 , 2, '.', '');
                                array_push($this->$cuotas_arr, array (
                                    'cuotas' => 16,
                                    'isAhora' => true,
                                    'total'  => $price_formated,
                                    'cuota'  => number_format( $price_formated / 6 , 2, '.', '')
                                ));
                            } else {};
                            break;
                        case 7:
                            if ( !empty($this->coef_a12) && is_numeric($this->coef_a12) ) {
                                $price_formated = number_format( $total_price * $this->coef_a12 , 2, '.', '');
                                array_push($this->$cuotas_arr, array (
                                    'cuotas' => 7,
                                    'isAhora' => true,
                                    'total'  => $price_formated,
                                    'cuota'  => number_format( $price_formated / 12 , 2, '.', '')
                                ));
                            } else {};
                            break;
                        case 8:
                            if ( !empty($this->coef_a18) && is_numeric($this->coef_a18) ) {
                                $price_formated = number_format( $total_price * $this->coef_a18 , 2, '.', '');
                                array_push($this->$cuotas_arr, array (
                                    'cuotas' => 8,
                                    'isAhora' => true,
                                    'total'  => $price_formated,
                                    'cuota'  => number_format( $price_formated / 18 , 2, '.', '')
                                ));
                            } else {};
                            break;
                    }
                };
            } else {
                $this->$cuotas_arr = "no";
            };

            $envios = array();
            foreach ( WC()->cart->get_shipping_packages() as $package_id => $package ) {
                if ( WC()->session->__isset( 'shipping_for_package_'.$package_id ) ) {
                    foreach ( WC()->session->get( 'shipping_for_package_'.$package_id )['rates'] as $shipping_rate_id => $shipping_rate ) {
                        array_push ( $envios, array (
                            'rate_id'     => $shipping_rate->get_id(),
                            'method_id'   => $shipping_rate->get_method_id(),
                            'instance_id' => $shipping_rate->get_instance_id(),
                            'label_name'  => $shipping_rate->get_label(),
                            'cost'        => $shipping_rate->get_cost(),
                            'tax_cost'    => $shipping_rate->get_shipping_tax(),
                            'taxes'       => $shipping_rate->get_taxes() 
                        ));
                    }
                }
            }

            // we need JavaScript to process a token only on cart/checkout pages, right?
            if ( ! is_cart() && ! is_checkout() && ! isset( $_GET['pay_for_order'] ) ) {
                return;
            }
            // if our payment gateway is disabled, we do not have to enqueue JS too
            if ( 'no' === $this->enabled ) {
                return;
            }
            // no reason to enqueue JavaScript if API keys are not set
            if ( empty( $this->private_key ) || empty( $this->publishable_key ) ) {
                return;
            }

            // scripts js

			$my_js_mask  = date("ymd-Gis", filemtime( plugin_dir_path( __FILE__ ) . '/assets/js/mask.js' ));
            $my_js_pago_uno = date("ymd-Gis", filemtime( plugin_dir_path( __FILE__ ) . '/assets/js/pagoUno.js' ));
            $my_js_cuotas = date("ymd-Gis", filemtime( plugin_dir_path( __FILE__ ) . '/assets/js/cuotas.js' ));

            wp_enqueue_script( 'jquery' );
			wp_enqueue_script( 'mask_js', plugins_url( '/assets/js/mask.js', __FILE__ ), array('jquery'), $my_js_mask );
            wp_enqueue_script( 'pago_uno_js', plugins_url( '/assets/js/pagoUno.js', __FILE__ ), array('jquery'), $my_js_pago_uno );
            wp_enqueue_script( 'cuotas_js', plugins_url( '/assets/js/cuotas.js', __FILE__ ), array('jquery'), $my_js_cuotas );

			wp_localize_script( 'mask_js', 'php_params_mask', array(
                'extendedForm' => $this->extended_form
            ));

            wp_localize_script( 'pago_uno_js', 'php_params', array(
                'publicKey'    => $this->publishable_key,
                'extendedForm' => $this->extended_form,
                'cuotas'       => $this->$cuotas_arr,
                'total'        => $woocommerce->cart->total
            ));

            wp_localize_script( 'cuotas_js', 'php_params_cuotas', array(
                'cuotas'       => $this->$cuotas_arr,
                'total'        => number_format( $total - $total_shipping , 2, '.', ''),
                'envios'       => $envios,
                'coef'         => array(
                    [
                        'cuota'   => 3,
                        'val'     => $this->coef_3
                    ],
                    [
                        'cuota'   => 6,
                        'val'     => $this->coef_6
                    ],
                    [
                        'cuota'   => 9,
                        'val'     => $this->coef_9
                    ],
                    [
                        'cuota'  => 12,
                        'val'    => $this->coef_12
                    ],
                    [
                        'cuota'  => 24,
                        'val'    => $this->coef_24
                    ],
                    [
                        'cuota'  => 13,
                        'val'    => $this->coef_a3
                    ],
                    [
                        'cuota'  => 16,
                        'val'    => $this->coef_a6
                    ],
                    [
                        'cuota'   => 7,
                        'val'     => $this->coef_a12
                    ],
                    [
                        'cuota'   => 8,
                        'val'     => $this->coef_a18
                    ]
                )
            ));
        }
        public function validate_fields() {
            //validacion para los campos
            return false;
        }
        public function process_payment( $order_id ) {

            global $woocommerce;

            // detalles de la orden
            $order = wc_get_order( $order_id );
            $order_data = $order -> get_data();
            $token_meta = $order -> get_meta('pagouno_token');
            $dues_meta  = $order -> get_meta('pagouno_cuotas');
            $total_meta = $order -> get_meta('pagouno_hidden_total');

            $dues_divider = $dues_meta;
            switch ($dues_meta) {
                case 13:
                    $dues_divider = 3;
                    $order -> update_meta_data( 'pagouno_cuotas', 'Ahora 3' );
                    break;
                case 16:
                    $dues_divider = 6;
                    $order -> update_meta_data( 'pagouno_cuotas', 'Ahora 6' );
                    break;
                case 7:
                    $dues_divider = 12;
                    $order -> update_meta_data( 'pagouno_cuotas', 'Ahora 12' );
                    break;
                case 8:
                    $dues_divider = 18;
                    $order -> update_meta_data( 'pagouno_cuotas', 'Ahora 18' );
                    break;
            }

            if ($dues_meta == 1) {
                $formated_price = str_replace( array(".", '"', "$"), "",  $order_data["total"] );
                $formated_price = intval($formated_price);
            } else {
                $order->set_total( $total_meta );
                if ($dues_meta == 13 || $dues_meta == 16 || $dues_meta == 7 || $dues_meta == 8) {
                    $order->set_payment_method_title( 'pagoUno Ahora ' . $dues_divider . ' en cuotas de $ ' . number_format( $total_meta / $dues_divider , 2 ));
                } else {
                    $order->set_payment_method_title( 'pagoUno en ' . $dues_divider . ' cuotas de $ ' . number_format( $total_meta / $dues_divider , 2 ));
                }
                $formated_price = str_replace( array(".", '"', "$"), "",  $total_meta );
                $formated_price = intval($formated_price);
            }
            $formated_dues = intval($dues_meta);

            $url = str_replace( array("http://", "www.", ".com", ".ar", ".cl", ".ur", ".br"), "",  get_site_url() );

            if ($token_meta == "-1") {
                delete_post_meta( $order_id, 'pagouno_token' );
                delete_post_meta( $order_id, 'pagouno_hidden_total' );
                wc_add_notice(  'Su tarjeta fue rechazada.', 'error' );
                return;
            } else {

                //parametros para el servicio de cobro de pagoUno
                $purch_list = new StdClass();
                $purch_list -> merchant_code_group = $this->merchant_code_group;
                $purch_list -> transaction_amount = $formated_price;
                $purch_list -> installments_plan = 0;
                $purch_list -> installments = $formated_dues;
                $purch_list -> transaction_currency_code = "032";
                $purch_list -> seller_descriptor = strval($url . " " . $order_id);

                $prim_acc = new StdClass();
                $prim_acc -> token_id = $token_meta;
                $prim_acc -> purchase_list = [$purch_list];

                $data = new StdClass();
                $data -> transaction_group_type = 1;
                $data -> customer_transaction_identificator = strval($order_id);
                $data -> external_reference = strval($order_id);
                $data -> primary_account_number_list = [$prim_acc];

                $payload = json_encode($data);

                $args = array(
                    'method'  => 'POST',
                    'headers' => array (
                        'Authorization' => $this->private_key,
                        'Content-Type'  => 'application/json',
                    ),
                    'body'    => $payload,
                );

                //interaccion con el servicio de cobro de pagoUno
                $response = wp_remote_post( 'https://api.pagouno.com/v1/Transaction/purchasegroup', $args );

                //evaluacion de la respuesta de pagoUno
                if( !is_wp_error( $response ) ) {
                    $body = json_decode( $response['body'], true );
                    if ( $body['status'] == 200 ) {
                        if ($body['data']['success']) {
                            delete_post_meta( $order_id, 'pagouno_token' );
                            delete_post_meta( $order_id, 'pagouno_hidden_total' );
                            $order->payment_complete();
                            $order->reduce_order_stock();
                            $order->add_order_note( 'Su orden fue procesada, gracias por su compra!', true );
                            $woocommerce->cart->empty_cart();
                            return array(
                                'result' => 'success',
                                'redirect' => $this->get_return_url( $order )
                            );
                        } else {
                            delete_post_meta( $order_id, 'pagouno_token' );
                            delete_post_meta( $order_id, 'pagouno_hidden_total' );
                            wc_add_notice(  'Su pago a sido rechazado.', 'error' );
                            return;
                        }
                    } else {
                        delete_post_meta( $order_id, 'pagouno_token' );
                        delete_post_meta( $order_id, 'pagouno_hidden_total' );
                        wc_add_notice(  'Error interno, intentelo mas tarde.', 'error' );
                        return;
                    }
                } else {
                    delete_post_meta( $order_id, 'pagouno_token' );
                    delete_post_meta( $order_id, 'pagouno_hidden_total' );
                    wc_add_notice(  'Error de conexion, pago no realizado.', 'error' );
                    return;
                }
            }
        }
    }
}