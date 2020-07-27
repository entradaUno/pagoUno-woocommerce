jQuery(document).ready(function ($) {

    let envioSelect = function(val) {
        if (php_params_cuotas.envios[0] !== undefined) {
            let envioPrecio = false;
            for (let i=0; i<php_params_cuotas.envios.length; i++) {
                if (php_params_cuotas.envios[i].rate_id === val){
                    envioPrecio = parseFloat(php_params_cuotas.envios[i].cost).toFixed(2);
                }
            }
            if ( envioPrecio === false ) {
                location.reload();
                return 0;
            } else {
                return parseFloat(envioPrecio).toFixed(2);
            }
        } else {
            //location.reload();
            return 0;
        }
    };

    let envio = function() {
        if (document.querySelector('#shipping_method') !== null) {
            if (php_params_cuotas.envios[0] !== undefined) {
                let checkbox = document.querySelector('#shipping_method').querySelectorAll('input');
                let val;
                for (let i=0; i<checkbox.length; i++) {
                    if(checkbox[i].checked) {
                        val = checkbox[i].getAttribute('value');
                    }
                }
                return val;   
            } else {
                location.reload();
            }
        } else {
            return 0;
        }
    }

    let cuotas = function(envio) {
        var lista_cuotas = $('#pagoUno_dues');
        
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
                        let coef = 1;
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

    function updatedCheckout() {
        $(document).on( 'updated_checkout', ()=>{
            cuotas(envio());
        });
    }

    $('body').on('init_checkout', function(){
        updatedCheckout();
    });
})