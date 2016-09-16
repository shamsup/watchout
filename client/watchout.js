// start slingin' some d3 here.
var drag = d3.behavior.drag()
  .on('drag', function(d, i) {
    var $this = d3.select(this);
    $this.attr('x', (d) => d3.event.x);
    $this.attr('y', (d) => d3.event.y);
  });
var mouse = d3.selectAll('.mouse').call(drag);
var board = d3.selectAll('g');
var scoreCounter = d3.selectAll('.scoreboard span');
var scores = [0, 0, 0];

scoreCounter.data(scores)
.text(function(count) {
  return count;
});

var update = function update(data) {
  var images = board.selectAll('image').data(data);
  images.transition().duration(1000)
    .attr('xlink:href', 'asteroid.png')
    .attr('height', '30px')
    .attr('width', '30px')
    .attr('x', point => point[0] + '%')
    .attr('y', point => point[1] + '%');

  images.enter()
    .append('image')
    .transition().duration(1000)
    .attr('xlink:href', 'asteroid.png')
    .attr('height', '30px')
    .attr('width', '30px')
    .attr('x', point => point[0] + '%')
    .attr('y', point => point[1] + '%');

  setTimeout(function() {
    var locations = getRandomLocations();
    update(locations);
  }, 1000);
};

var getRandomLocations = function getRandomLocations () {
  var locations = [];
  for (var i = 0; i < 20; i++) {
    locations.push([Math.random() * 100, Math.random() * 100]);
  }
  return locations;
};

var move = function move() {
  scores[1] += 1;
  if (scores[1] > scores[0]) {
    scores[0] = scores[1];
  }
  mouse.call(collide);
  scoreCounter.data(scores).text(count => count);
  window.requestAnimationFrame(move);
};

var collide = function collide() {
  node = this.node();
  nodeBox = node.getBBox();
  nodeLeft = nodeBox.x;
  nodeRight = nodeBox.x + nodeBox.width;
  nodeTop = nodeBox.y;
  nodeBottom = nodeBox.y + nodeBox.height;

  board.selectAll('image')
    .each(function() {
      otherBox = this.getBBox();

      otherLeft = otherBox.x;
      otherRight = otherBox.x + otherBox.width;
      otherTop = otherBox.y;
      otherBottom = otherBox.y + otherBox.height;

      collideHoriz = nodeLeft < otherRight && nodeRight > otherLeft;
      collideVert = nodeTop < otherBottom && nodeBottom > otherTop;

      if ( collideHoriz && collideVert) {
        scores[2] += 1;
        scores[1] = 0;
      //  mouse.attr('xlink:href', 'splatter.gif')
      }
    });
};


update(getRandomLocations());

window.requestAnimationFrame(move);
