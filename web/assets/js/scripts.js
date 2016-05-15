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
                    d3.select('.canvas').selectAll('p')
                        .data(data)
                        .enter()
                        .append('span')
                        .style('display', 'block')
                        .style('font-family', 'Courier')
                        .html(function(item) {
                            var value = item.value.toString();
                            var count = item.count.toString();

                            if (item.value <= 9) {
                                value += '&nbsp;';
                            }

                            if (item.count <= 9) {
                                count += '&nbsp;';
                            }

                            var text = 'Picked ' + value + ' ' + count + ' time' + (item.count > 1 ? 's' : '&nbsp;');

                            text += '&nbsp;' + '-'.repeat(item.count);

                            return text;
                        });
                }
            });
        };

        return {
            'init': init
        };
    })();
})();
