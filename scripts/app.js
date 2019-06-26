
class ImageCreator {
  static capture (x, y, width, height) {
    return new Promise((resolve, reject) => {
      html2canvas(document.body, { x, y, width, height }).then(resolve).catch(reject);
    });
  }

  static create (canvas) {
    const image = new Image();
    image.src = canvas.toDataURL();
    return image;
  }
}

$(() => {
  const $body = $(document.body);
  const $capture = $('#capture');
  const $cancel = $('#cancel');
  const $clear = $('#clear');
  const keydown = e => {
    if (e.altKey && e.keyCode === 67) {
      $body.data('capture', true);
    }

    if (e.keyCode === 27) {
      $body.data('capture', false);
    }
  };
  const highlight = e => $body.data('capture') && $(e.target).addClass('capture-highlight');
  const unhighlight = e => $(e.target).removeClass('capture-highlight');
  const select = e => {
    if (!$body.data('capture')) { return; }

    const $target = $(e.target);
    const offset = $target.offset();
    const width = $target.outerWidth();
    const height = $target.outerHeight();

    ImageCreator.capture(offset.left, offset.top, width, height).then(canvas => {
      $('#output').append($('<div class="captured-image">').append(ImageCreator.create(canvas)));
    });

    e.stopImmediatePropagation();
    e.preventDefault();
  };

  $capture.click(e => {
    !$body.data('capture') && e.stopPropagation();
    $body.data('capture', true);
  });

  $cancel.click(e => {
    $body.data('capture', false);
  });

  $clear.click(e => {
    !$body.data('capture') &&  $('#output').empty();
  });

  $body
    .keydown(keydown)
    .mouseover(highlight)
    .mouseout(unhighlight)
    .click(select);
});

