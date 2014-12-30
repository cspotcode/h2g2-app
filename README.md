This is a quick-and-dirty "Hitchhiker's Guide to the Galaxy" app I made in a couple hours for a Halloween costume.  It plays the classic guide sound effect from the radio show and TV show, looks up definitions on [Urban Dictionary](http://www.urbandictionary.com/) (it's funnier than Wikipedia or h2g2.com) and reads them aloud in a British voice (if you install an external text-to-speech engine).

## Quick Start

1.  Clone or download this repository.
1.  Use npm to install dependencies.

        > npm install
1.  Install [Ivona Text-to-Speech](http://www.ivona.com/us/for-individuals/voices-for-windows/) with the "Brian" British English voice.
1.  Sign up for a [Mashape](https://www.mashape.com) account, find the [Urban dictionary API](https://www.mashape.com/community/urban-dictionary), and get your personal Mashape API Key.  Put this into `config.js`.
1.  Launch Ivona's UI and enable the clipboard monitor.
1.  Launch this app with node-webkit:
    
        > RUN.bat

## Questions

Feel free to [file an issue](https://github.com/cspotcode/h2g2-app/issues); the code is messy and I'm happy to offer quick-fixes or guidance if you ever want to use this app.

## Details

It runs in [node-webkit](https://github.com/rogerwang/node-webkit) and was designed for my Microsoft Surface which, when properly decorated, can pass as the Hitchhiker's Guide.  Other tablets should work as well.

It uses an [unofficial Urban Dictionary API](https://www.mashape.com/community/urban-dictionary) I found on [Mashape](httpw://www.mashape.com).  As luck would have it, looking up "Earth" produces appropriate results.

I used the [Ivona Text-to-Speech engine](http://www.ivona.com/us/for-individuals/voices-for-windows/) with the "Brian" British English voice.  Ivona is a commercial product; they offer a free 30 day trial.  Ivona's UI has a clipboard monitor that will watch the Windows clipboard and read any copied text aloud.  My app is built for this; it uses node-webkit's clipboard API to "copy" any definition it wants to be read aloud.  It "copies" an empty string to tell Ivona to stop talking.

Windows 8 has an on-screen keyboard that automatically opens in certain situations.  Unfortunately, focusing a textbox in node-webkit is not one of those situations.  Fortunately, Windows 8 has an .exe that you can run to open the on-screen keyboard.  This app invokes that .exe every time the text box received focus.

The visual design is... good enough.  I was trying to match the Guide's glowing wireframe style from the classic BBC TV show, not its style from the Disney movie.

## License

My code is licensed under the MIT License.  Third-party components have their own licenses.
