const display: any = document.querySelector("#display");
const buttons: any = document.querySelectorAll("button");

let textfield: string = "";
buttons.forEach(button => {
    button.addEventListener("click", () => {
        // const value = button.getAttribute("value") as string;
        let value = button.value as string;
        console.log(value);
        console.log('text:', textfield)

        switch (value) {
            case "C":
                // Clear the display
                textfield = '';
                display.innerText = '';
                break;
            case "del":
                if (textfield.length > 0) {
                    textfield = textfield.slice(0, -1);
                    display.innerText = textfield;
                }
            case "=":
                try {
                    const result = eval(textfield);
                    textfield = result;
                    display.innerText = result;
                }
                catch (error) {
                    textfield = "Error";
                    display.innerText = textfield;
                }
                break;

            default:
                textfield += value
                display.innerText = textfield;
                break;
        }
    })
});

import image from '../images/BongoCat.png';

const img = document.createElement('img');
img.src = image;
document.body.appendChild(img);
