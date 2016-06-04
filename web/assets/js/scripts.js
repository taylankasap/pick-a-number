(function() {
    // Foundation plugins & customizations
    (function() {
        $(document).foundation();

        // Add `min` validator
        Foundation.Abide.defaults.validators['min'] = function($el, required, parent) {
            if (!required) {
                return true;
            }

            var from = $el.attr('data-min'),
                to = $el.val();

            return (parseInt(to) >= parseInt(from));
        };

        // Add `max` validator
        Foundation.Abide.defaults.validators['max'] = function($el, required, parent) {
            if (!required) {
                return true;
            }

            var from = $el.attr('data-max'),
                to = $el.val();

            return (parseInt(to) <= parseInt(from));
        };
    })();

    // Show modal to the user so they can pick a number
    (function() {
        var $modalElem = $('#pick-a-number-modal');

        if ($modalElem.length > 0) {
            var $modal = new Foundation.Reveal($modalElem, {
                'closeOnClick': false,
                'closeOnEsc': false
            });

            $modal.open();

            $modalElem.find('form').on('submit', function() {
                var form = this;
                var $form = $(form);

                // Prevent multiple form submits at once
                if ($form.attr('data-submitted')) {
                    return false;
                }

                if (form.checkValidity()) {
                    $form.attr('data-submitted', true);

                    $.ajax({
                        'method': $form.attr('method'),
                        'url': $form.attr('action'),
                        'data': $form.serialize(),
                        'success': function(response) {
                            if (response.success) {
                                $modal.close();
                                graph.init();
                            } else {
                                var $alert = $('<div class="alert callout"></div>');
                                response.errors.forEach(function(error) {
                                    $alert.append('<p>' + error + '</p>');
                                });

                                $form.before($alert);
                            }
                        }
                    });
                }

                return false;
            });
        }
    })();

    // Graph
    var graph = (function() {
        var init = function() {
            $.ajax({
                type: 'GET',
                url: '/value-counts',
                success: function(data) {
                    data.sort(function(item1, item2) {
                        if (item1.value === item2.value) {
                            return 0;
                        }

                        return item1.value < item2.value ? -1 : 1;
                    });

                    var counts = data.map(function(item) {
                        return item.count;
                    });

                    var calcLuminance = d3.scale.linear()
                        .domain([0, Math.max.apply(Math, counts)])
                        .range([80, 30]);

                    var canvas = d3.select('.canvas');
                    canvas.selectAll()
                        .data(data)
                        .enter()
                        .append('div')
                        .html(function(item) {
                            return item.value + '<br>' + item.count;
                        })
                        .style('background-color', function(item) {
                            return 'hsl(' + 48 + ',' + 89 + '%,' + calcLuminance(item.count) + '%)';
                        })
                        .transition()
                        .delay(function(d, i) {
                            return i * 20;
                        })
                        .duration(1000)
                        .style('transform', function(item) {
                            // return item.attr('data-animation');
                            return canvas.attr('data-animation');
                        });
                }
            });
        };

        return {
            'init': init
        };
    })();

    var baseColorHsl = [48, 89, 50];
})();
