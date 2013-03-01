$(document).ready(function () {
    var StatsRouter = Backbone.Router.extend({
        routes: {
            "": "loadInstruments",
            "events": "loadEvents",
            "*unimplemented": "unimplemented"
        },
        unimplemented: function () {
            // yup
        },
        loadInstruments: function () {
            if (window.app.instruments) { return; }
            window.app.instruments = new Stats.collections.Instruments();
            var instruments = window.app.instruments;
            var from = new Date();
            from.setDate(from.getDate() - 5);
            var to = new Date();
            $('#date_range').text(moment(from).format('YYYY/MM/DD') + ' - ' + moment(to).format('YYYY/MM/DD'));

            instruments.fetch({
                data: {project: window.project},
            }).then(function () {
                instruments.each(function (instrument) {
                    v = new Stats.views.Instrument({
                        model: instrument,
                        field: 'max'
                    });
                    instrument.getData({
                        from: from,
                        to: to,
                    });

                    $('#instruments').append(v.el);
                    v.render();

                });
            });
        },
        loadEvents: function () {
            if (window.app.events) { return; }
            window.app.events = new Stats.collections.Events();
            var events = window.app.events;
            events.fetch().then(function () {
                var alt = false;
                events.each(function (event) {
                    var v = new Stats.views.Event({
                        model: event,
                        alt: alt
                    });
                    $('.timeline').append(v.el);
                    v.render();
                    alt = !alt;
                });
            });
        },
    });
    window.app = new StatsRouter();
    app.on('route', function () {
        var path = Backbone.history.fragment;
        $('.main-menu>li').removeClass('active');
        $('.main-menu>li[data-tab='+path+']').addClass('active');
        $('#content>div').hide();
        $('[data-content='+path+']').show();
    });

    Backbone.history.start({
        pushState: true,
        root: window.project
    });

    $('.main-menu a').on('click', function (e) {
        e.preventDefault();
        var route = $(e.target).closest('li').attr('data-tab');
        window.app.navigate(route, {trigger: true});
    });
});