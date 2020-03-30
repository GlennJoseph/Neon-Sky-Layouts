let element = $('.widget-abc123');

let data = {
    config: {
        // content editor
        layout: "horizontal", //"vertical"

        // design editor
        textVertAlign: "flex-start", //"flex-end" "center"
        textAlign: "left" //"right" "center"
    }
}



let spreadSheet = "https://docs.google.com/spreadsheets/d/1hajHiAqwYQkRnL7JtKq9UYc0OtZdUbU9itK2-nNnPZI/edit?usp=sharing";
let id = spreadSheet.substr(spreadSheet.indexOf("d/") + 2).replace('/edit?usp=sharing','');
let gsxResp;
let dataObj;
let layout = data.config.layout;
let textVertAlign = data.config.textVertAlign;
let textAlign = data.config.textAlign;

$.ajax({
    url: `https://spreadsheets.google.com/feeds/list/${id}/default/public/values?alt=json`
}).then(function(resp){
    gsxResp = resp.feed.entry;
    
    dataObj = gsxResp.map((i) => {
        return {
            id: i.gsx$id.$t,
            title: i.gsx$title.$t,
            images: i.gsx$images.$t,
            caption: i.gsx$caption.$t,
            description: i.gsx$description.$t,
            linkText: i.gsx$linktext.$t
        }
    });

    switch (layout){
        case 'vertical':
            createVertHTML(dataObj);
        case 'horizontal':
            createHoriHTML(dataObj);
    }


    function createVertHTML(response){
        response.map((i, index) => {
            let output = `
                <div class="vertItem">

                    <div class="imgCol">
                        <div class="imgContainer" data-index="${index}">
                            <img src="${i.images}">
                        </div>
                    </div>

                    <div class="textCol">
                        <div class="textContainer">
                            <div class="textTitle">
                                <h4>${i.title}</h4>
                            </div>
                            <div class="textDesc">
                                <span>${i.description}</span>
                            </div>
                        </div>
                    </div>

                </div>
            `;
            $(element).find('.vertItems').append(output);
        });
        $(element).find('.textCol').css('justify-content', textVertAlign);
        $(element).find('.textCol').css('text-align', textAlign);
    }

    function createHoriHTML(response){
        response.map((i, index) => {
            let output = `
                <div class="horiItem">
                    <div class="imgCol">
                        <div class="imgContainer" data-index="${index}">
                            <img src="${i.images}">
                        </div>
                    </div>
                    <div class="textTitle">
                        <h4>${i.title}</h4>
                    </div>
                </div>
            `;
            $(element).find('.horiItems').append(output);
        });
        
        $(element).find('.horiItem .imgContainer').click(function(){
            let current = $(this).attr("data-index");
            $(element).find('.horiItemDetails').empty();
            $(element).find('.horiItemDetails').append(`
                <div class="textTitle">
                    <h4>${response[current].title}</h4>
                </div>
                <div class="textDesc">
                    <span>${response[current].description}</span>
                </div>
                <div class="closeBtn">
                    <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">
                        <g>
                            <g>
                                <path d="M284.286,256.002L506.143,34.144c7.811-7.811,7.811-20.475,0-28.285c-7.811-7.81-20.475-7.811-28.285,0L256,227.717
                                L34.143,5.859c-7.811-7.811-20.475-7.811-28.285,0c-7.81,7.811-7.811,20.475,0,28.285l221.857,221.857L5.858,477.859
                                c-7.811,7.811-7.811,20.475,0,28.285c3.905,3.905,9.024,5.857,14.143,5.857c5.119,0,10.237-1.952,14.143-5.857L256,284.287
                                l221.857,221.857c3.905,3.905,9.024,5.857,14.143,5.857s10.237-1.952,14.143-5.857c7.811-7.811,7.811-20.475,0-28.285
                                L284.286,256.002z"/>
                            </g>
                        </g>
                    </svg>
                </div>
            `);
            ($(element).find('.horiItemDetails').is(':visible')) ? $(element).find('.horiItemDetails').slideUp() : $(element).find('.horiItemDetails').slideDown();
            $(element).find('.horiItemDetails .closeBtn').click(function(){
                $(element).find('.horiItemDetails').slideUp();
            });
        });
    }
});