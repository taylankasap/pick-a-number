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
        var $modal = $('#pick-a-number-modal');

        if ($modal.length > 0) {
            var $modal = new Foundation.Reveal($('#pick-a-number-modal'), {
                'closeOnClick': false,
                'closeOnEsc': false
            });

            $modal.open();
        }
    })();

    // Graph
    (function() {
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
    })();
})();
