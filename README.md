# http-predict

HTTP satellite tracking and prediction service written in Node.js.

Existing software solutions needs compilation, and are typically restricted to one programming language.
By exposing the functionality as an HTTP service, you can now obtain real-time satellite tracking information from
nearly all programming languages with HTTP support.

# Deployment

1. `git clone https://github.com/ctmakro/http-predict.git` or download from github
2. `cd http-predict`
3. run `npm install` for dependencies
4. Fill `config.js` with your SpaceTrack credentials
5. run `node spaceTrackDownloader.js` to obtain latest data from the API address specified in `config.js`.
the result will be saved to `spaceTrackData.json`.
6. run `node index.js` to start the server. Direct your browser to `localhost:3000`.

And, check the demo at <https://bbs.kechuang.org/static/tracker/>

# License

None

# Special Thanks to Andrew T. West

A modified copy of his PredictLib was included in this repository.
