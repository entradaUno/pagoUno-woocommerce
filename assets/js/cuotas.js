jQuery(document).ready(function ($) {
    let cuotas = function(data) {
        var lista_cuotas = jQuery('#pagoUno_dues');
        
        lista_cuotas.html('');
    
        var option_default = document.createElement('option');
        option_default.setAttribute('value', '1-false');
        option_default.innerHTML = '1 solo pago de $' + data.total;
        lista_cuotas.append(option_default);
    
        if(data.cuotas_arr !== "no"){
            data.cuotas_arr.forEach( cuota => {
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
                        //let envioCosto = envioSelect(envio);
                        for (let i=0; i<php_params_cuotas.coef.length; i++) {
                            if (parseInt(php_params_cuotas.coef[i].cuota) === cuota.cuotas){
                                coef = parseFloat(php_params_cuotas.coef[i].val);
                            }
                        }
                        option.setAttribute('value', cuota.cuotas + '-' + cuota.total);
                        option.innerHTML = ahora_cu + 
                        ' cuotas con ' + ahora_le + 
                        ' de $ ' + 
                        cuota.cuota + 
                        ' (Total: $' + 
                        cuota.total + 
                        ')';
                    } else {
                        if (cuota.si) {
                            //let envioCosto = envioSelect(envio);
                            option.setAttribute('value', cuota.cuotas + '-' + cuota.total);
                            option.innerHTML = cuota.cuotas  + 
                            ' cuotas sin interes de $ ' + cuota.cuota + 
                            ' (Total: $' + 
                            cuota.total +
                            ')';
                        } else {
                            //let envioCosto = envioSelect(envio);
                            option.setAttribute('value', cuota.cuotas + '-' + cuota.total);
                            option.innerHTML = cuota.cuotas  + 
                            ' cuotas de $ ' + cuota.cuota + 
                            ' (Total: $' + 
                            cuota.total +
                            ')';
                        }
                    }
                    lista_cuotas.append(option);
                }
            });
        }
    }

    jQuery(document).on('init_checkout wc-credit-card-form-init updated_checkout', function() {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'X-WP-Nonce': php_params_cuotas.nonce
        });
        fetch(php_params_cuotas.url, {
            method: 'get',
            headers: headers,
            credentials: 'same-origin'
        })
        .then(response => {
            return response.ok ? response.json() : 'Not Found...';
        }).then(json_response => {
            cuotas(json_response);
        });
    });
})
