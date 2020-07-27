$(document).ready(function(){


	var language = {}

	language['C'] = '#include <stdio.h>\n\nint main(void) \n{\n	printf("Hello World!\\n");\n	return 0;\n}\n';
	language['CPP'] = '#include <iostream>\nusing namespace std;\n\nint main()\n{\n     cout << "Hello World!" << endl;\n     return 0;\n}\n';
	language['JAVA'] = 'class TestClass {\n    public static void main(String args[] ) throws Exception {\n        System.out.println("Hello World!");\n    }\n}\n';


	ace.require("ace/ext/language_tools");
	var editor = ace.edit("editor");
	var selectedLang = "CPP";
	editor.setTheme("ace/theme/twilight");
	editor.session.setMode("ace/mode/c_cpp");
	editor.getSession().setTabSize(5);
	var source_code = editor.getValue();
	editor.setFontSize(16);
	editor.setValue(language[selectedLang],-1);
	editor.getSession().on('change', function(e) {
		updateContent();
		if(source_code == ""){
			$("#runcode").prop('disabled', true);
		}
		else{
			$("#runcode").prop('disabled', false);
		}
	});
	// editor.session.getSelection().clearSelection();

	//To Download the code in the editor
	function download(content,lang){
		var e = {
			"C":"c","CPP":"cpp","JAVA":"java"
		};
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
		element.setAttribute('download', "file." + e[lang]);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}

	$("#download").click(function(){
		updateContent();
		download(source_code, $("#lang").val());

	});

	//To get the current contents in the editor
	function updateContent(){
		source_code = editor.getValue();
	}

	
	//Compiling the Code
	function compileCode(){
		updateContent();
		var run_data = {
				source: source_code,
				lang: selectedLang,
		};
		$.ajax({
			url: "run/",
			type: "POST",
			data: run_data,
			dataType: "json",
			success: function(data){
				if((jQuery.isEmptyObject(data))){
					$("#output").val('Compiled Successfully')
				}else{
					$("#output").val(data)
				}
			}

		});


	}

	$("#runcode").click(function(){
		compileCode();
	});



	//When Changing the language
	$("#lang").change(function(){
		selectedLang = $("#lang").val();
		editor.setValue(language[selectedLang],-1);
		if(selectedLang == "C" || selectedLang == "CPP"){
			editor.getSession().setMode("ace/mode/c_cpp");
		}
		else{
			editor.getSession().setMode("ace/mode/" + selectedLang.toLowerCase());
		}
		editor.session.getSelection().clearSelection();
	});

	//When changing the theme
	$("#theme").change(function(){
		themeSelected = $("#theme").val();
		if(themeSelected == "Light"){
			editor.setTheme("ace/theme/dawn");
		}
		else if(themeSelected == "Monokai"){
			editor.setTheme("ace/theme/monokai");
		}
		else if(themeSelected == "Solarised Light"){
			editor.setTheme("ace/theme/solarized_light");
		}
		else if(themeSelected == "Twilight"){
			editor.setTheme("ace/theme/twilight");
		}
	});

});
// To Get the CSRFToken
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});
