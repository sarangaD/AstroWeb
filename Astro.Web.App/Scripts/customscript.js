var selectedItems = [];

$(document).ready(function () {
    LoadExistingItemGrid();

});

function LoadExistingItemGrid() {
    $.ajax({
        url: 'http://ams-api.astro.com.my/ams/v3/getChannelList',
        success: function (response) {
            $('#dtChannel').dataTable({
                data: response.channels,
                columns: [
                    { "data": "channelId" },
                    { "data": "channelTitle" },
                    { "data": null }
                ],
                searching: true,
                "columnDefs": [{
                    "targets": -1,
                    "data": "channelId",
                    "defaultContent": "<a><span style=\"font-size: 18px;\" class=\"glyphicon glyphicon-star-empty\"></span></a>"
                }],
                "fnDrawCallback": function () {
                    getFavoriteList();
                }
            });
        }
    });

    $('#dtChannel').on('click', 'td', function (evt) {
        if ($(this).index() < 2) {
            var row = $(this).parents('tr');
            var Id = row.find('td:eq(0)').text();
            var channelDtl = getChannelDetails(Id);
            $('#orderModal').modal("show");
        }
    });

    $('#dtChannel').on('click', 'td:last-child', function (evt) {
        var row = $(this).parents('tr');
        var Id = row.find('td:eq(0)').text();
        var setMode = '';
        if ($(this).find('span').hasClass('glyphicon-star')) {
            $(this).find('span').removeClass('glyphicon-star')
            $(this).find('span').addClass('glyphicon-star-empty');
            setMode = 'Remove';
        } else {
            $(this).find('span').removeClass('glyphicon-star-empty')
            $(this).find('span').addClass('glyphicon-star');
            setMode = 'Add';
        }
        saveFavoriteList(Id, setMode);
    });


}

function getChannelDetails(Id) {
    $.ajax({
        url: 'http://ams-api.astro.com.my/ams/v3/getChannels?channelId=' + Id,
        type: 'GET',
        success: function (response) {
            $('#channelTitle').text(response.channel[0].channelTitle);
            $('#channelDescription').text(response.channel[0].channelDescription);
        }
    });

}

function saveFavoriteList(Id, setMode) {
    $.post({
        url: location.protocol + '//' + location.host + '/Home/SaveFavouriteList?Id=' + Id + '&setMode=' + setMode,
        type: 'POST',
        success: function (response) {
        }
    });
}

function getFavoriteList() {
    $.post({
        url: location.protocol + '//' + location.host + '/Home/GetFavouriteList',
        type: 'POST',
        success: function (response) {

            $("#dtChannel tr").filter(function () {
                return $.inArray($(this).find('td:eq(0)').text(), response.Ids) !== -1;
            }).find('td:eq(2)').find('span').removeClass('glyphicon-star-empty').addClass('glyphicon-star');

        }
    });
}
