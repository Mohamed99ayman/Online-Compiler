// https://www.sitepoint.com/get-url-parameters-with-javascript/
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

function injectPlugInCode() {
    if (urlParams.has('lang') && urlParams.has('code')) {

        const lang = urlParams.get('lang')
        var code = urlParams.get('code')

        // https://ace.c9.io/#nav=embedding
        var editor = ace.edit("editor");
        //https://ace.c9.io/#nav=howto
        //editor.session.setUseWrapMode(true);
        editor.setOption("wrap", 79);

        if (urlParams.has('light')) {
            select('theme', 'Light');
            editor.setTheme("ace/theme/dawn");
            document.body.style.backgroundColor = "#FBFBFB";
            document.getElementById("ide").style.maxWidth = "800px";
            document.getElementById('topbar_table').rows[0].deleteCell(2);
        }

        // https://stackoverflow.com/a/23612498
        var langSelector = document.getElementById("lang");
        // Create a new 'change' event
        var event = new Event('change');

        switch (lang) {
            case "c":
                select('lang', 'C');
                editor.session.setMode("ace/mode/c_cpp");
                break;
            case "c++":
            case "cpp":
                select('lang', 'CPP');
                editor.session.setMode("ace/mode/c_cpp");
                break;
            case "j":
            case "java":
                select('lang', 'JAVA');
                editor.session.setMode("ace/mode/java");
                break;
            case "py":
            case "python":
                select('lang', 'Python');
                editor.session.setMode("ace/mode/python");
                break;
        }

        //supress warning https://github.com/securingsincity/react-ace/issues/29
        editor.$blockScrolling = 1;

        // Dispatch it.
        langSelector.dispatchEvent(event);

        code = code.split('\0').join('\n');
        editor.session.setValue(code.toString());
    
    }
}

// https://thisinterestsme.com/change-select-option-javascript/#:~:text=The%20unique%20ID%20of%20our,out%20of%20the%20for%20loop.
function select(selectId, optionValToSelect) {
    //Get the select element by it's unique ID.
    var selectElement = document.getElementById(selectId);
    //Get the options.
    var selectOptions = selectElement.options;
    //Loop through these options using a for loop.
    for (var opt, j = 0; opt = selectOptions[j]; j++) {
        //If the option of value is equal to the option we want to select.
        if (opt.value == optionValToSelect) {
            //Select the option and break out of the for loop.
            selectElement.selectedIndex = j;
            if (selectId == 'lang')
                selectElement.disabled = true;
            break;
        }
    }
}