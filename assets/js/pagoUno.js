

jQuery(document).ready(function ($) {
    var isValidEmail = function (email) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    }
    var successCallback = function(data) {
        const button = document.querySelector('#place_order');
        //guardo el token en el form de woocommerce
        jQuery('#pagouno_token').val(data.data[0].id);
        //guardo la cantidad de cuotas
        var dues_val = jQuery('#pagoUno_dues').val().split('-');
        jQuery('#pagouno_cuotas').val(dues_val[0]);
        jQuery('#pagouno_hidden_total').val(dues_val[1]);
        //obtengo el form de woocommerce
        var checkout_form = jQuery( 'form.woocommerce-checkout' );
        // desactivo token request
        checkout_form.off( 'checkout_place_order', tokenRequest );
        // hago submit del form
        button.disabled = false;
        checkout_form.submit();
        // al a hacer submit vuelve a llamar a tokenRequest
        checkout_form.on( 'checkout_place_order', tokenRequest );
    };
    var errorCallback = function(data) {
        const button = document.querySelector('#place_order');
        jQuery('#pagouno_token').val("-1");
        //guardo la cantidad de cuotas
        var dues_val = jQuery('#pagoUno_dues').val().split('-');
        jQuery('#pagouno_cuotas').val(dues_val[0]);
        jQuery('#pagouno_hidden_total').val(dues_val[1]);
        var checkout_form = jQuery( 'form.woocommerce-checkout' );
        // desactivo token request
        checkout_form.off( 'checkout_place_order', tokenRequest );
        // hago submit del form
        button.disabled = false;
        checkout_form.submit();
        // al a hacer submit vuelve a llamar a tokenRequest
        checkout_form.on( 'checkout_place_order', tokenRequest );
    };
    var tokenRequest = function() {
        var checkout_form = jQuery( 'form.woocommerce-checkout' );
        const button = document.querySelector('#place_order');
        button.disabled = true;

        var validator = true;

        // validacion para los campos -----------------------------------------------------------------------------
        var ccNum = jQuery('#pagoUno_ccNo').val();
        var ccExpDate = jQuery('#pagoUno_expdate').val();
        var cvc = jQuery('#pagoUno_cvc').val();
        var name = jQuery('#pagoUno_ccName').val();
        var docNum = jQuery('#pagoUno_ccDocNum').val();
        var email = jQuery('#billing_email').val();

        // validacion y formateo del numero de tarjeta

        if (ccNum.length > 0) {
            ccNum = ccNum.replace(/ /g, '');
            if (ccNum.length !== 16) {
                validator = false;
                jQuery('#pagoUno_ccNo').addClass('pu-invalid');
            } else {
                if( jQuery('#pagoUno_ccNo').hasClass( "pu-invalid" ) ){
                    validator = false;
                }
            }
        } else {
            validator = false;
            jQuery('#pagoUno_ccNo').addClass('pu-invalid');
        }

        // validacion y formateo de la fecha de vencimiento de la tarjeta
        if (ccExpDate.length > 0) {
            ccExpDate = ccExpDate.replace(/\//g, '');
            if(ccExpDate.length === 4){
                if (jQuery('#pagoUno_expdate').hasClass( "pu-invalid" )){
                    validator = false;
                } else {
                    ccExpDate = ccExpDate[2] + ccExpDate[3] + ccExpDate[0] + ccExpDate[1];
                }
            } else {
                validator = false;
                jQuery('#pagoUno_expdate').addClass('pu-invalid');
            }
        } else {
            validator = false;
            jQuery('#pagoUno_expdate').addClass('pu-invalid');
        }

        // validacion y formateo del cvc
        if (cvc.length > 0) {
            if (cvc.length !== 3) {
                validator = false;
                jQuery('#pagoUno_cvc').addClass('pu-invalid');
            } else {
                if (jQuery('#pagoUno_cvc').hasClass( 'pu-invalid' )) {
                    validator = false;
                }
            }
        } else {
            validator = false;
            jQuery('#pagoUno_cvc').addClass('pu-invalid');
        }

        // validacion del nombre de usuario
        if (name.length > 0) {
            var patt = new RegExp("[0-9]", "g");
            if( patt.test( name )){
                validator = false;
                jQuery('#pagoUno_ccName').addClass('pu-invalid');
            }
        } else {
            validator = false;
            jQuery('#pagoUno_ccName').addClass('pu-invalid');
        }

        // validacion para el numero de documento
        if (docNum.length > 0) {
            if( jQuery('#pagoUno_ccDocNum').hasClass( "pu-invalid" ) ){
                validator = false;
            } else {
                docNum = docNum.replace(/\./g, '');
            }
        } else {
            validator = false;
            jQuery('#pagoUno_ccDocNum').addClass( "pu-invalid" );
        }

        // validacion para los campos adicionales ----------------------------------------------------------------

        if (php_params.extendedForm == "yes") {

            var bDate = jQuery('#pagoUno_birthDate').val();
            var country = jQuery('#pagoUno_country').val();
            var state = jQuery('#pagoUno_state').val();
            var city = jQuery('#pagoUno_city').val();
            var street = jQuery('#pagoUno_street').val();
            var streetNumber = jQuery('#pagoUno_streetNumber').val();
            email = jQuery('#pagoUno_email').val();

            // validacion para el email
            if(email.length > 0 ){
                email = email.toLowerCase();
                if (!isValidEmail(email)) {
                    validator = false;
                    jQuery('#pagoUno_email').addClass('pu-invalid');
                }
            } else {
                validator = false;
                jQuery('#pagoUno_email').addClass('pu-invalid');
            }

            // validacion para la fecha de nacimiento
            if (bDate.length > 0) {
                bDate = bDate.replace(/\//g, '');
                if( bDate.length !== 8){
                    validator = false;
                    jQuery('#pagoUno_birthDate').addClass('pu-invalid');
                } else {
                    if (jQuery('#pagoUno_birthDate').hasClass('pu-invalid')) {
                        validator = false;
                    }
                }
            } else {
                validator = false;
                jQuery('#pagoUno_birthDate').addClass('pu-invalid');
            }

            // validacion para el pais
            if(country.length > 0){
                var patt = new RegExp("[0-9]", "g");
                if( patt.test( country )){
                    validator = false;
                    jQuery('#pagoUno_country').addClass('pu-invalid');
                }
            } else {
                validator = false;
                jQuery('#pagoUno_country').addClass('pu-invalid');
            }

            // validacion para la provincia
            if(state.length > 0){
                var patt = new RegExp("[0-9]", "g");
                if( patt.test( state )){
                    validator = false;
                    jQuery('#pagoUno_state').addClass('pu-invalid');
                }
            } else {
                validator = false;
                jQuery('#pagoUno_state').addClass('pu-invalid');
            }

            // validacion para la ciudad
            if(city.length > 0){} else {
                validator = false;
                jQuery('#pagoUno_city').addClass('pu-invalid');
            }

            // validacion para la calle
            if(street.length > 0){} else {
                validator = false;
                jQuery('#pagoUno_street').addClass('pu-invalid');
            }

            // validacion para la altura
            if(streetNumber.length > 0){} else {
                validator = false;
                jQuery('#pagoUno_streetNumber').addClass('pu-invalid');
            }
        }

        if (jQuery("#payment_method_pagouno").is(':checked')) {

            if (validator) {

                jQuery('#pagoUno_ccNo').removeClass('pu-invalid');
                jQuery('#pagoUno_expdate').removeClass('pu-invalid');
                jQuery('#pagoUno_cvc').removeClass('pu-invalid');
                jQuery('#pagoUno_ccName').removeClass('pu-invalid');
                jQuery('#pagoUno_ccDocNum').removeClass('pu-invalid');

                if (php_params.extendedForm == "yes") {
                    
                    jQuery('#pagoUno_email').removeClass('pu-invalid');
                    jQuery('#pagoUno_birthDate').removeClass('pu-invalid');
                    jQuery('#pagoUno_country').removeClass('pu-invalid');
                    jQuery('#pagoUno_state').removeClass('pu-invalid');
                    jQuery('#pagoUno_city').removeClass('pu-invalid');
                    jQuery('#pagoUno_street').removeClass('pu-invalid');
                    jQuery('#pagoUno_streetNumber').removeClass('pu-invalid');
                    
                };

                var pagounoForm = {
                    ccNo: ccNum,
                    ccExpDate: ccExpDate,
                    cvc: cvc,
                    name: name,
                    phone: jQuery('#pagoUno_phone').val(),
                    email: email,
                    bDate: bDate,
                    address: {
                        country: country,
                        state: state,
                        city: city,
                        street: street,
                        door_number: streetNumber
                    },
                    identification: {
                        document_type: jQuery('#pagoUno_ccDocType').val(),
                        document_number: docNum
                    }
                }

                var body = [];
                var publicKey = php_params.publicKey;
                //obtengo los valores para el body
                if (php_params.extendedForm == "no") {
                    body[0] = {
                        primary_account_number: pagounoForm.ccNo,
                        expiration_date: pagounoForm.ccExpDate,
                        card_security_code: pagounoForm.cvc,
                        card_holder: {
                            first_name: "",
                            last_name: "",
                            front_name: pagounoForm.name,
                            telephone: "",
                            email: pagounoForm.email,
                            birth_date: "",
                            address: {
                                country: "",
                                state: "",
                                city: "",
                                street: "",
                                door_number: ""
                            },
                            identification: {
                                document_type: pagounoForm.identification.document_type,
                                document_number: pagounoForm.identification.document_number
                            }
                        }
                    }
                } else {
                    body[0] = {
                        primary_account_number: pagounoForm.ccNo,
                        expiration_date: pagounoForm.ccExpDate,
                        card_security_code: pagounoForm.cvc,
                        card_holder: {
                            first_name: "",
                            last_name: "",
                            front_name: pagounoForm.name,
                            telephone: pagounoForm.phone,
                            email: pagounoForm.email,
                            birth_date: pagounoForm.bDate,
                            address: {
                                country: pagounoForm.address.country,
                                state: pagounoForm.address.state,
                                city: pagounoForm.address.city,
                                street: pagounoForm.address.street,
                                door_number: pagounoForm.address.door_number
                            },
                            identification: {
                                document_type: pagounoForm.identification.document_type,
                                document_number: pagounoForm.identification.document_number
                            }
                        }
                    }
                }
                $.ajax({
                    method: "POST",
                    url: "https://api.pagouno.com/v1/Transaction/token",
                    data: JSON.stringify(body),
                    contentType: 'application/json',
                    dataType: 'json',
                    headers: {
                        Authorization: publicKey,
                        'x-api-fp': ''
                    }
                }).done(function( response ) {
                    if(response.status === 200){
                        successCallback(response);
                    } else {
                        errorCallback(response);
                    }
                });
            } else {
                button.disabled = false;
                checkout_form.off( 'checkout_place_order', tokenRequest );
                checkout_form.on( 'checkout_place_order', tokenRequest );
            }
        } else {
            var checkout_form = jQuery( 'form.woocommerce-checkout' );
            checkout_form.off( 'checkout_place_order', tokenRequest );
            button.disabled = false;
            checkout_form.submit();
            checkout_form.on( 'checkout_place_order', tokenRequest );
        }
        return false;
    };
	var checkout_form = jQuery( 'form.woocommerce-checkout' );
    checkout_form.on( 'checkout_place_order', tokenRequest );
});
