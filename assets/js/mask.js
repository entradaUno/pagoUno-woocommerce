function isValidExpiresDate(month, year) {
    var currentTime, expiry, prefix;

    if (!(month && year)) {
        return false;
    }

    month = parseInt(month, 10);

    if (!(month && month <= 12)) {
        return false;
    }

    if (year.length === 2) {
        prefix = new Date().getFullYear();
        prefix = prefix.toString().slice(0, 2);
        year = prefix + year;
    }

    expiry = new Date(year, month);

    currentTime = new Date();

    expiry.setMonth(expiry.getMonth() - 1);
    expiry.setMonth(expiry.getMonth() + 1, 1);

    return expiry > currentTime;
}
function isNaranja(v) {
    const reg = /^589562[0-9]{0,}$/;
    return reg.test(v);
}
function isValidLuhn(value) {
    if (/[^0-9-\s]+/.test(value)) return false;

    let nCheck = 0, bEven = false;

    value = value.replace(/\D/g, "");

    for (var n = value.length - 1; n >= 0; n--) {
        var cDigit = value.charAt(n),
        nDigit = parseInt(cDigit, 10);

        if (bEven && (nDigit *= 2) > 9) nDigit -= 9;

        nCheck += nDigit;
        bEven = !bEven;
    }

    return (nCheck % 10) === 0;
}
function isNaranjaValidLuhn(value) {
    if (/[^0-9-\s]+/.test(value)) return false;

    value = value.replace(/\D/g, "");

    const nDigitList = value.split("").map(function(d) {
        return parseInt(d);
    });

    if (nDigitList.length > 15) {
        const R = (nDigitList[0] * 4) + (nDigitList[1] * 3) + (nDigitList[2] * 2) + (nDigitList[3] * 7) + (nDigitList[4] * 6)
            + (nDigitList[5] * 5) + (nDigitList[6] * 4) + (nDigitList[7] * 3) + (nDigitList[8] * 2) + (nDigitList[9] * 7)
            + (nDigitList[10] * 6) + (nDigitList[11] * 5) + (nDigitList[12] * 4) + (nDigitList[13] * 3) + (nDigitList[14] * 2);

        let X16 = 11 - (R % 11);

        if (X16 > 9) {
            X16 = 0;
        }

        return nDigitList[15] === X16;
    } else {
        return false;
    }
}
$(document).ready(() => {
    setTimeout(()=>{

        $.extend(Cleave.CreditCardDetector.blocks, {
            cabal: [4, 4, 4, 4],
            naranja: [4, 4, 4, 4],
        });

        $.extend(Cleave.CreditCardDetector.re, {
            cabal: /^589657[0-9]{0,}$/,
            naranja: /^589562[0-9]{0,}$/,
        });

        let creditCardNumber = document.querySelector('#pagoUno_ccNo');
        let creditCardSecurityCode = document.querySelector('#pagoUno_cvc');
        let creditCardExpires = document.querySelector('#pagoUno_expdate');
        let creditCardDocNumber = document.querySelector('#pagoUno_ccDocNum');
        let creditCardName = document.querySelector('#pagoUno_ccName');
        let email = document.querySelector('#pagoUno_email');

        var cCreditCard = new Cleave(creditCardNumber, {
            creditCard: true,
            creditCardStrictMode: false,
            onCreditCardTypeChanged: function(type) {
                if (type === "unknown"){
                    document.querySelector('#pu_cc_type').innerHTML = "";
                } else {
                    document.querySelector('#pu_cc_type').innerHTML = '(' + type + ')';
                }
            }
        });

        var cVerification = new Cleave(creditCardSecurityCode, {
            numeral: true,
            numeralThousandsGroupStyle: 'none'
        });
        var cExpires = new Cleave(creditCardExpires, {
            date: true,
            datePattern: ['m', 'y']
        });
        var cDocNumber= new Cleave(creditCardDocNumber, {
            numeral: true,
            numeralThousandsGroupStyle: 'none'
        });


        creditCardNumber.addEventListener('input', function (e) {
            var rawValue = cCreditCard.getRawValue();
            var target = e.target;

            if (!isNaranja(rawValue)) {
                if (isValidLuhn(rawValue) && rawValue.length) {
                    $(target).parent('.form-row').removeClass('woocommerce-invalid');
                    $('#puCcError').css("display", "none");
                } else {
                    $(target).parent('.form-row').addClass('woocommerce-invalid');
                }
            } else {
                if (isNaranjaValidLuhn(rawValue) && rawValue.length) {
                    $(target).parent('.form-row').removeClass('woocommerce-invalid');
                    $('#puCcError').css("display", "none");
                } else {
                    $(target).parent('.form-row').addClass('woocommerce-invalid');
                }
            }
        });

        creditCardSecurityCode.addEventListener('input', function (e) {
            var rawValue = cVerification.getRawValue();
            var target = e.target;
            if (rawValue.length) {
                $(target).parent('.form-row').removeClass('woocommerce-invalid');
                $('#puCvcError').css("display", "none");
            } else {
                $(target).parent('.form-row').addClass('woocommerce-invalid');
            }
        });

        creditCardExpires.addEventListener('input', function (e) {
            var rawValue = cExpires.getRawValue();
            var target = e.target;
            let isFutureDate = false;
            if (rawValue.length === 4) {
                isFutureDate = isValidExpiresDate(rawValue[0] + rawValue[1] , rawValue[2] + rawValue[3]);
            } else {
                isFutureDate = false;
            }
            if (rawValue.length && isFutureDate) {
                $(target).parent('.form-row').removeClass('woocommerce-invalid');
                $('#puEpError').css("display", "none");
            } else {
                $(target).parent('.form-row').addClass('woocommerce-invalid');
            }
        });

        creditCardName.addEventListener('input', function (e) {
            $('#puNameError').css("display", "none");
        });

        creditCardDocNumber.addEventListener('input', function (e) {
            var rawValue = cDocNumber.getRawValue();
            var target = e.target;
            if (rawValue.length) {
                $(target).parent('.form-row').removeClass('woocommerce-invalid');
                $('#puDocNumError').css("display", "none");
            } else {
                $(target).parent('.form-row').addClass('woocommerce-invalid');
            }
        });

        email.addEventListener('input', function (e) {
            $('#puEmailError').css("display", "none");
        });

        if (php_params.extendedForm === "yes") {
            let birthDate = document.querySelector('#pagoUno_birthDate');
            let phoneNumber = document.querySelector('#pagoUno_phone');
            let country = document.querySelector('#pagoUno_country');
            let state = document.querySelector('#pagoUno_state');
            let city = document.querySelector('#pagoUno_city');
            let street = document.querySelector('#pagoUno_street');
            let streetNumber = document.querySelector('#pagoUno_streetNumber');

            var cBirthDate = new Cleave(birthDate, {
                date: true,
            });

            var cPhone = new Cleave(phoneNumber, {
                numeral: true,
                numeralThousandsGroupStyle: 'none'
            });

            birthDate.addEventListener('input', function (e) {
                var rawValue = cBirthDate.getRawValue();
                var target = e.target;
                if (rawValue.length) {
                    $(target).parent('.form-row').removeClass('woocommerce-invalid');
                    $('#puBirthDateError').css("display", "none");
                } else {
                    $(target).parent('.form-row').addClass('woocommerce-invalid');
                }
            });

            country.addEventListener('input', function (e) {
                $('#puCountryError').css("display", "none");
            });

            state.addEventListener('input', function (e) {
                $('#puStateError').css("display", "none");
            });

            city.addEventListener('input', function (e) {
                $('#puCityError').css("display", "none");
            });

            street.addEventListener('input', function (e) {
                $('#puStreetError').css("display", "none");
            });

            streetNumber.addEventListener('input', function (e) {
                $('#puStreetNumberError').css("display", "none");
            });

        }
    }, 1000);
});
