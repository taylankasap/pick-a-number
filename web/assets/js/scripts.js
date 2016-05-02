(function() {
    $(document).foundation();

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
})();
