var ghpages = require('gh-pages');
var path = require('path');
ghpages.publish(path.join(__dirname, 'build'),{
  branch: 'master',
  repo: 'https://github.com/oliktva/oliktva.github.io.git:/wood'
}, callback);
