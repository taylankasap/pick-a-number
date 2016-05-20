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

                $form.attr('data-submitted', true);

                if (form.checkValidity()) {
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
                        if (item1.count === item2.count) {
                            return 0;
                        }

                        return item1.count < item2.count ? 1 : -1;
                    });

                    var x = d3.scale.linear()
                        .domain([0, data[0].count])
                        .range([0, $(window).height()]);

                    d3.select('.canvas').selectAll('p')
                        .data(data)
                        .enter()
                        .append('div')
                        .html(function(item) {
                            return item.value;
                        })
                        .style('width', function(item) {
                            return $(window).width() / data.length + 'px';
                        })
                        .style('background-color', function(item) {
                            return next(colors);
                        })
                        .transition()
                        .duration(2000)
                        .style('height', function(item) {
                            return x(item.count) + 'px';
                        });
                }
            });
        };

        return {
            'init': init
        };
    })();

    var colors = [
        '#1dd2af',
        '#3498db',
        '#c0392b',
        '#9b59b6',
        '#34495e',
        '#2ecc71',
        '#2980b9',
        '#16a085',
        '#7f8c8d',
        '#8e44ad',
        '#2c3e50',
        '#f1c40f',
        '#e67e22',
        '#e74c3c',
        '#27ae60',
        '#95a5a6',
        '#f39c12',
        '#d35400',
        '#bdc3c7'
    ];

    function next(arr) {
        if (typeof this.cursor !== 'number' || this.cursor >= arr.length) {
            this.cursor = 0;
        } else {
            this.cursor++;
        }

        return arr[this.cursor];
    }
})();
