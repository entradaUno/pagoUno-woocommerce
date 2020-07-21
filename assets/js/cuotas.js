jQuery(document).ready(function ($) {
    let cuotas = function(envio) {
        var lista_cuotas = $('#pagoUno_dues');
        function envioSelect(val) {
            if (php_params_cuotas.envios[0] !== undefined) {
                let envioPrecio;
                for (let i=0; i<php_params_cuotas.envios.length; i++) {
                    if (php_params_cuotas.envios[i].rate_id === val){
                        envioPrecio = parseFloat(php_params_cuotas.envios[i].cost).toFixed(2);
                    }
                }
                return parseFloat(envioPrecio).toFixed(2);
            } else {
                return 0;
            }
        };

        lista_cuotas.html('');

        var option_default = document.createElement('option');
        option_default.setAttribute('value', '1-false');
        option_default.innerHTML = '1 solo pago de $' + (parseFloat(php_params_cuotas.total) + parseFloat(envioSelect(envio))).toFixed(2);
        lista_cuotas.append(option_default);

        if(php_params_cuotas.cuotas !== "no"){
            php_params_cuotas.cuotas.forEach( cuota => {
                if(!isNaN(parseFloat(cuota.total)) && cuota.total > 0){
                    var option = document.createElement('option');
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
                        let coef;
                        let envioCosto = envioSelect(envio);
                        for (let i=0; i<php_params_cuotas.coef.length; i++) {
                            if (parseInt(php_params_cuotas.coef[i].cuota) === cuota.cuotas){
                                coef = parseFloat(php_params_cuotas.coef[i].val);
                            }
                        }
                        option.setAttribute('value', cuota.cuotas + '-' + (parseFloat(cuota.total) + parseFloat((envioCosto * coef))).toFixed(2));
                        option.innerHTML = ahora_cu +
                        ' cuotas con ' + ahora_le +
                        ' de $ ' +
                        (parseFloat(cuota.cuota) + parseFloat(((envioCosto / ahora_cu) * coef))).toFixed(2) +
                        ' (Total: $' +
                        (parseFloat(cuota.total) + parseFloat((envioCosto * coef))).toFixed(2) +
                        ')';
                    } else {
                        let coef;
                        let envioCosto = envioSelect(envio);
                        for (let i=0; i<php_params_cuotas.coef.length; i++) {
                            if (parseInt(php_params_cuotas.coef[i].cuota) === cuota.cuotas){
                                coef = parseFloat(php_params_cuotas.coef[i].val);
                            }
                        }
                        option.setAttribute('value', cuota.cuotas + '-' + (parseFloat(cuota.total) + parseFloat((envioCosto * coef))).toFixed(2));
                        option.innerHTML = cuota.cuotas  +
                        ' cuotas de $ ' + (parseFloat(cuota.cuota) + parseFloat(((envioCosto / cuota.cuota) * coef))).toFixed(2) +
                        ' (Total: $' +
                        (parseFloat(cuota.total) + parseFloat((envioCosto * coef))).toFixed(2) +
                         ')';
                    }
                    lista_cuotas.append(option);
                }
            });
        }
    }

    let listener = function() {
        if (document.querySelector('#shipping_method') !== null) {
            let checkbox = document.querySelector('#shipping_method').querySelectorAll('input');

            checkbox.forEach( check => {
                check.addEventListener( 'change', function() {
                    if(this.checked) {
                        jQuery(document.body).bind('update_checkout', function () {
                            cuotas(envio());
                            listener();
                        });
                    }
                });
            });
        }
    }

    let envio = function() {
        if (document.querySelector('#shipping_method') !== null) {
            let checkbox = document.querySelector('#shipping_method').querySelectorAll('input');
            let val;
            for (let i=0; i<checkbox.length; i++) {
                if(checkbox[i].checked) {
                    val = checkbox[i].getAttribute('value');
                }
            }
            return val;
        } else {
            return 0;
        }
    }
    setTimeout(() => {
        cuotas(envio());
        listener();
    }, 1500);
})
