# toggl-csv-to-pdf

Had the idea to create a custom pdf generator for Toggl reports, but then I realised, that the exported CSV file didn't contain all the data that I wanted, so I haven't finished it.

Essentially this is a script to generate a PDF using Handlebars to render an HTML template from data provided by a CSV file.

## Usage

Assuming you've added the directory to your PATH (or that the module has been installed globally with npm)

`report-to-pdf FILE.csv OUTPUT.pdf [--filter "filter query"] [--v]`

options:
* --filter: Comma separated queries that describe how to filter the CSV data. Example: `"Project:ProjectId,Duration>00:05:00"` (Select only entries with Project === ProjectId and a duration greater than 5 minutes)
* --v: Verbose

## Develop

`npm install`

Then

`node .`

## License

Licensed under the MIT license.
