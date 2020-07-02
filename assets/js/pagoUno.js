jQuery(document).ready(function ($) {
    var isValidEmail = function (email) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    }
    var successCallback = function(data) {
        const button = document.querySelector('#place_order');
        //guardo el token en el form de woocommerce
        $('#pagouno_token').val(data.data[0].id);
        //guardo la cantidad de cuotas
        var dues_val = $('#pagoUno_dues').val().split('-');
        $('#pagouno_cuotas').val(dues_val[0]);
        $('#pagouno_hidden_total').val(dues_val[1]);
        //obtengo el form de woocommerce
        var checkout_form = $( 'form.woocommerce-checkout' );
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
        $('#pagouno_token').val("-1");
        //guardo la cantidad de cuotas
        var dues_val = $('#pagoUno_dues').val().split('-');
        $('#pagouno_cuotas').val(dues_val[0]);
        $('#pagouno_hidden_total').val(dues_val[1]);
        var checkout_form = $( 'form.woocommerce-checkout' );
        // desactivo token request
        checkout_form.off( 'checkout_place_order', tokenRequest );
        // hago submit del form
        button.disabled = false;
        checkout_form.submit();
        // al a hacer submit vuelve a llamar a tokenRequest
        checkout_form.on( 'checkout_place_order', tokenRequest );
    };
    var tokenRequest = function() {
        var checkout_form = $( 'form.woocommerce-checkout' );
        const button = document.querySelector('#place_order');
        button.disabled = true;

        var validator = true;

        // validacion para los campos -----------------------------------------------------------------------------
        var ccNum = $('#pagoUno_ccNo').val();
        var ccExpDate = $('#pagoUno_expdate').val();
        var cvc = $('#pagoUno_cvc').val();
        var name = $('#pagoUno_ccName').val();
        var docNum = $('#pagoUno_ccDocNum').val();
        var email = $('#pagoUno_email').val();

        // validacion y formateo del numero de tarjeta

        if (ccNum.length > 0) {
            ccNum = ccNum.replace(/ /g, '');
            if (ccNum.length !== 16) {
                validator = false;
                $('#pagoUno_ccNo').parent('.form-row').removeClass('woocommerce-invalid');
                $('#puCcError').css("display", "");
            } else {
                if( $('#pagoUno_ccNo').parent('.form-row').hasClass( "woocommerce-invalid" ) ){
                    $('#pagoUno_ccNo').parent('.form-row').removeClass('woocommerce-invalid');
                    $('#puCcError').css("display", "");
                    validator = false;
                }else {
                    $('#puCcError').css("display", "none");
                }
            }
        } else {
            validator = false;
            $('#pagoUno_ccNo').parent('.form-row').removeClass('woocommerce-invalid');
            $('#puCcError').css("display", "");
        }

        // validacion y formateo de la fecha de vencimiento de la tarjeta
        if (ccExpDate.length > 0) {
            ccExpDate = ccExpDate.replace(/\//g, '');
            if(ccExpDate.length === 4){
                if ($('#pagoUno_expdate').parent('.form-row').hasClass( "woocommerce-invalid" )){
                    validator = false;
                    $('#pagoUno_expdate').parent('.form-row').removeClass('woocommerce-invalid');
                    $('#puEpError').css("display", "");
                } else {
                    ccExpDate = ccExpDate[2] + ccExpDate[3] + ccExpDate[0] + ccExpDate[1];
                    $('#puEpError').css("display", "none");
                }
            } else {
                validator = false;
                $('#pagoUno_expdate').parent('.form-row').removeClass('woocommerce-invalid');
                $('#puEpError').css("display", "");
            }
        } else {
            validator = false;
            $('#pagoUno_expdate').parent('.form-row').removeClass('woocommerce-invalid');
            $('#puEpError').css("display", "");
        }

        // validacion y formateo del cvc
        if (cvc.length > 0) {
            if (cvc.length !== 3) {
                validator = false;
                $('#pagoUno_cvc').parent('.form-row').removeClass('woocommerce-invalid');
                $('#puCvcError').css("display", "");
            } else {
                if ($('#pagoUno_cvc').parent('.form-row').hasClass( "woocommerce-invalid" )) {
                    validator = false;
                    $('#pagoUno_cvc').parent('.form-row').removeClass('woocommerce-invalid');
                    $('#puCvcError').css("display", "");
                } else {
                    $('#puCvcError').css("display", "none");
                }
            }
        } else {
            validator = false;
            $('#pagoUno_cvc').parent('.form-row').removeClass('woocommerce-invalid');
            $('#puCvcError').css("display", "");
        }

        // validacion del nombre de usuario
        if (name.length > 0) {
            var patt = new RegExp("[0-9]", "g");
            if( patt.test( name )){
                $('#puNameError').css("display", "");
                validator = false;
            }
        } else {
            $('#puNameError').css("display", "");
            validator = false;
        }

        // validacion para el numero de documento
        if (docNum.length > 0) {
            if($('#pagoUno_ccDocNum').parent('.form-row').hasClass( "woocommerce-invalid" )){
                $('#puDocNumError').css("display", "");
                $('#pagoUno_ccDocNum').parent('.form-row').removeClass('woocommerce-invalid');
                validator = false;
            } else {
                $('#puDocNumError').css("display", "none");
                docNum = docNum.replace(/\./g, '');
            }
        } else {
            $('#puDocNumError').css("display", "");
            $('#pagoUno_ccDocNum').parent('.form-row').removeClass('woocommerce-invalid');
            validator = false;
        }

        // validacion para el email
        if(email.length > 0 ){
            email = email.toLowerCase();
            if (!isValidEmail(email)) {
                $('#puEmailError').css("display", "");
                validator = false;
            }
        } else {
            $('#puEmailError').css("display", "");
            validator = false;
        }

        // validacion para los campos adicionales ----------------------------------------------------------------
        var bDate = $('#pagoUno_birthDate').val();
        var country = $('#pagoUno_country').val();
        var state = $('#pagoUno_state').val();
        var city = $('#pagoUno_city').val();
        var street = $('#pagoUno_street').val();
        var streetNumber = $('#pagoUno_streetNumber').val();

        if (php_params.extendedForm == "yes") {

            // validacion para la fecha de nacimiento
            if (bDate.length > 0) {
                bDate = bDate.replace(/\//g, '');
                if( bDate.length !== 8){
                    $('#pagoUno_birthDate').parent('.form-row').removeClass('woocommerce-invalid');
                    $('#puBirthDateError').css("display", "");
                    validator = false;
                } else {
                    if ($('#pagoUno_birthDate').parent('.form-row').hasClass( "woocommerce-invalid" )) {
                        $('#pagoUno_birthDate').parent('.form-row').removeClass('woocommerce-invalid');
                        $('#puBirthDateError').css("display", "");
                        validator = false;
                    }
                }
            } else {
                $('#pagoUno_birthDate').parent('.form-row').removeClass('woocommerce-invalid');
                $('#puBirthDateError').css("display", "");
                validator = false;
            }

            // validacion para el pais
            if(country.length > 0){
                var patt = new RegExp("[0-9]", "g");
                if( patt.test( country )){
                    $('#puCountryError').css("display", "");
                    validator = false;
                }
            } else {
                $('#puCountryError').css("display", "");
                validator = false;
            }

            // validacion para la provincia
            if(state.length > 0){
                var patt = new RegExp("[0-9]", "g");
                if( patt.test( state )){
                    $('#puStateError').css("display", "");
                    validator = false;
                }
            } else {
                $('#puStateError').css("display", "");
                validator = false;
            }

            // validacion para la ciudad
            if(city.length > 0){} else {
                $('#puCityError').css("display", "");
                validator = false;
            }

            // validacion para la calle
            if(street.length > 0){} else {
                $('#puStreetError').css("display", "");
                validator = false;
            }

            // validacion para la altura
            if(streetNumber.length > 0){} else {
                $('#puStreetNumberError').css("display", "");
                validator = false;
            }
        }

        if ($("#payment_method_pagouno").is(':checked')) {

            if (validator) {

                $('#puCcError').css("display", "none");
                $('#puEpError').css("display", "none");
                $('#puCvcError').css("display", "none");
                $('#puNameError').css("display", "none");
                $('#puDocNumError').css("display", "none");
                $('#puEmailError').css("display", "none");

                if (php_params.extendedForm == "yes") {
                    $('#puBirthDateError').css("display", "none");
                    $('#puCountryError').css("display", "none");
                    $('#puStateError').css("display", "none");
                    $('#puCityError').css("display", "none");
                    $('#puStreetError').css("display", "none");
                    $('#puStreetNumberError').css("display", "none");
                };

                var pagounoForm = {
                    ccNo: ccNum,
                    ccExpDate: ccExpDate,
                    cvc: cvc,
                    name: name,
                    phone: $('#pagoUno_phone').val(),
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
                        document_type: $('#pagoUno_ccDocType').val(),
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
            var checkout_form = $( 'form.woocommerce-checkout' );
            checkout_form.off( 'checkout_place_order', tokenRequest );
            button.disabled = false;
            checkout_form.submit();
            checkout_form.on( 'checkout_place_order', tokenRequest );
        }
        return false;
    };
	var checkout_form = $( 'form.woocommerce-checkout' );
    checkout_form.on( 'checkout_place_order', tokenRequest );

    setTimeout(() => {
        var lista_cuotas = $('#pagoUno_dues');

        var option_default = document.createElement('option');
        option_default.setAttribute('value', '1-false');
        option_default.innerHTML = '1 solo pago de $' + php_params.total;
        lista_cuotas.append(option_default);

        if(php_params.cuotas !== "no"){
            php_params.cuotas.forEach( cuota => {
                if(!isNaN(parseFloat(cuota.total)) && cuota.total > 0){
                    var option = document.createElement('option');
                    option.setAttribute('value', cuota.cuotas + '-' + cuota.total);
                    if (cuota.isAhora) {
                        var ahora_le = '';
                        var ahora_cu = '';
                        switch (cuota.cuotas) {
                            case 13:
                                ahora_le = 'Ahora 3';
                                ahora_cu = 3;
                                break;
                            case 16:
                                ahora_le = 'Ahora 6';
                                ahora_cu = 6;
                                break;
                            case 7:
                                ahora_le = 'Ahora 12';
                                ahora_cu = 12;
                                break;
                            case 8:
                                ahora_le = 'Ahora 18';
                                ahora_cu = 18;
                                break;
                        }
                        option.innerHTML = ahora_cu + ' cuotas con ' + ahora_le + ' de $ ' + cuota.cuota + ' (Total: $' + cuota.total + ')';
                    } else {
                        option.innerHTML = cuota.cuotas + ' cuotas de $ ' + cuota.cuota + ' (Total: $' + cuota.total + ')';
                    }
                    lista_cuotas.append(option);
                }
            });
        }
    }, 1500);
});
