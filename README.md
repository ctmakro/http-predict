# http-predict

HTTP satellite tracking and prediction service written in Node.js.

Existing software solutions needs compilation, and are typically restricted to one programming language.
By exposing the functionality as an HTTP service, you can now obtain real-time satellite tracking information from
nearly all programming languages with HTTP support.

# Deployment

You should have Node.js v4(or above) installed on your system.

```bash

$ git clone https://github.com/ctmakro/http-predict.git
$ cd http-predict
$ npm install
$ cp config_example.js config.js

```

Then fill `config.js` with your SpaceTrack credentials.

After that,
```bash

$ node spaceTrackDownloader.js

```
to obtain latest data from the API address specified in `config.js`.
The result will be saved to `spaceTrackData.json`.

Finally,
```bash

$ node index.js

```
to start the server. Windows users may doubleclick on `run_server.bat`.

Now direct your browser to `localhost:3000`.


Oh and, check the demo at <https://bbs.kechuang.org/static/tracker/>

# License

None

# Special Thanks to Andrew T. West

A modified copy of his PredictLib was included in this repository.
