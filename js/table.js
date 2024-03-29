var produktet = {};
var produktetId = {};
var bleresit = [];
updateNrFat();
$(function () {
    calculateDetails();
    setSasiaDefault();
    updateBleresin();
    updateNrFat();
    updateSot();
    updateBleresinArrayAndInput();
    updateProduktetArrayAndInput();
    getNumrinEFunditFatures();
    $('#txtArtikulli').change(function () {
        $('#txtSasia').text($(this).find(":selected").text());
    });

    $('#btnAdd').on('click', function () {
        setSasiaDefault();
        var sasia, qmimi, artikulli;
        artikulli = $("#txtArtikulli").val();
        sasia = $("#txtSasia").val();
        qmimi = $("#txtQmimi").val();

        if(sasia === ".5")sasia = "0.5";
        
        //var edit = "<a class='edit' href='JavaScript:voartikulli(0);' >Edit</a>";
        var del = "<a class='delete' href='JavaScript:voartikulli(0);'><img style='max-width:20px; max-height:20px;' src='/images/minusWhite.png'></a>";

        var barcode;

        if (artikulli == "") {
            alert("Sheno artikullin!");
        } else {
            //uncomment to add the barcode
            for (const [key, value] of Object.entries(produktetId)) {
                //console.log(key, value);
                if(artikulli === key){
                    barcode = value;
                }
            }
            qmimi = parseFloat(qmimi).toFixed(2);
            var table = "<tr><td>" + artikulli + "<span id='barcode'>" +barcode + "</span></td><td>" + sasia + "</td><td>" + (qmimi) + "</td><td>" + (parseFloat(sasia) * parseFloat(qmimi)).toFixed(2) + "</td><td>" + del + "</td></tr>";
            $("#tblCustomers").append(table);
        }
        //add barcode
        //<span id='barcode'>" +barcode + "</span>"
        artikulli = $("#txtArtikulli").val("");
        sasia = $("#txtSasia").val("");
        qmimi = $("#txtQmimi").val("");

        calculateDetails();

        Clear();
    });

    function updateBleresinArrayAndInput() {
        $.getJSON("../data/bleresit.json", function (data) {
            var bleresitN = '';
            $.each(data, function (key, value) {
                bleresitN += '<option value="' + value.emri + '"> </option>';
                var bleresiAktual = {
                    emri: value.emri,
                    adresa: value.adresa,
                    fiskali: value.fiskali
                }
                bleresit.push(bleresiAktual);

            });
            $('#bleresit').append(bleresitN);
        });
    }


    function updateProduktetArrayAndInput() {
        $.getJSON("../data/products.json",
            function (data) {
                var product = '';
                $.each(data, function (key, value) {

                    product += '<option value="' + value.emri + '"> </option>';
                    produktet[value.emri] = value.qmimi;
                    produktetId[value.emri] = value.id;
                });
                $('#artikujt').append(product);
            });
    }

    function calculateDetails() {
        //iterating through table tds with each method and 
        var totalSasia = 0.0,
            totalVlera = 0.0;
        $("#tblCustomers").find('tr').each(function (i, el) {
            var $tds = $(this).find('td'),
                artikulli = $tds.eq(0).text(),
                sasia = parseFloat($tds.eq(1).text()),
                qmimi = parseFloat($tds.eq(3).text());

            if (!isNaN(sasia) && !isNaN(qmimi)) {
                totalSasia += sasia;
                totalVlera += qmimi;
            }



            //console.log(i +": " +artikulli + sasia + qmimi);
        })
        var pagesa = (totalVlera).toFixed(2);
        var tvsh18 = ((pagesa / 118) * 100).toFixed(2);
        var vleraPaTvsh = (pagesa - tvsh18).toFixed(2);

        $("#pakoTxt").text(totalSasia);
        $("#tvshTxt").text(vleraPaTvsh + "€");
        $("#paTvshTxt").text(tvsh18 + "€");
        $("#pagesaTxt").text(pagesa + "€");



        //console.log(totalVlera +"|"+totalSasia);
    }

    $('#btnUpdate').on('click', function () {
        var name, country, id;
        id = $("#txtArtikulli").val();
        name = $("#txtSasia").val();
        country = $("#txtQmimi").val();

        $('#tblCustomers tbody tr').eq($('#hfRowIndex').val()).find('td').eq(1).html(name);
        $('#tblCustomers tbody tr').eq($('#hfRowIndex').val()).find('td').eq(2).html(country)

        $('#btnAdd').show();
        $('#btnUpdate').hide();
        Clear();
    });

    $("#tblCustomers").on("click", ".delete", function (e) {
        $(this).closest('tr').remove();
        calculateDetails();
    });

    $('#btnClear').on('click', function () {
        Clear();
    });

    $("#tblCustomers").on("click", ".edit", function (e) {
        var row = $(this).closest('tr');
        $('#hfRowIndex').val($(row).index());
        var td = $(row).find("td");
        $('#txtArtikulli').val($(td).eq(0).html());
        $('#txtSasia').val($(td).eq(1).html());
        $('#txtQmimi').val($(td).eq(2).html());
        $('#btnAdd').hide();
        $('#btnUpdate').show();
    });
});

function Clear() {
    $("#txtArtikulli").val("");
    $("#txtSasia").val("");
    $("#txtQmimi").val("");
    $("#hfRowIndex").val("");
}

function getPrice() {
    setSasiaDefault();
    var selectedProd = $("#txtArtikulli").val();
    for (const [key, value] of Object.entries(produktet)) {
        //console.log(key, value);
        if (selectedProd === key) {
            $("#txtQmimi").val(value);
        }
    }
}

function updateBleresin() {
    $("#bleresi").text($("#browser").val());
    //var selectedBleresi = $("browser").val();
    bleresit.forEach(b => {
        if ($("#browser").val() === b.emri) {
            $("#nrFiskal").text(b.fiskali);
            $("#adresa").text(b.adresa);
            console.log($("#adresa").text());
            console.log($("#nrFiskal").text());
        }
    });
}

function getNumrinEFunditFatures() {
    //read from JSON 
    // $.getJSON("../data/details.json", function (data) {
    //     $("#nrFatures").val(data.nrFundit);
    // });
    var nrFundit = localStorage.getItem('nrFunditStorage');
    if (nrFundit === null) {
        localStorage.setItem('nrFunditStorage', 1);
        $("#nrFatures").val("1");
    } else {
        $("#nrFatures").val(nrFundit);
    }

}

function addOneToNrFatFundit() {
    var obj = localStorage.getItem('nrFunditStorage');
    var FatPlusOne = parseInt(obj) + 1;

    localStorage.setItem('nrFunditStorage', FatPlusOne);
}

function clearTable() {
    window.location.href = window.location.href;
    addOneToNrFatFundit();
}

function setSasiaDefault() {
    var sasia = $("#txtSasia").val();
    if (sasia == '') {
        $("#txtSasia").val("1");
    }
}

function selectSasia() {
    $("#txtSasia").select();
}

function selectQmimi() {
    $("#txtQmimi").select();
}

function selectArtikulli() {
    $("#txtArtikulli").select();
}

function updateNrFat() {
    //console.log("HIT");
    var fatInput = $("#nrFatures").val() + "/2022";
    $("#nrFaturesPrint").text(fatInput);
}

function updateSot() {
    $("#dataSot").text(new Date().toLocaleDateString('en-GB'))
}
