const NUMBER = "number";
const PRECISION = 100;

var debugPanel = {

	buffer: "",
	button: [
		{ name: "Move Speed: ", value: eval(makePtr("_PLAYER_MOVE_SPEED")) },
	],

	selected: undefined,
	highlighted: undefined,

	x: 10,
	y: 20,
	offsetY: 15,
	width: 150,

	font: '15px Consolas',
	color: 'lime',
	highlightColor: 'yellow',
};

function drawPanelWithButtons(panel, precision)
{
	var x = panel.x;
	var y = panel.y;

	for (var i = 0; i < panel.button.length; i++)
	{
		var button = panel.button[i];
		var buttonY = y - panel.offsetY;
		var color = panel.color;

		if (button == panel.highlighted)
		{
			color = panel.highlightColor;
		}

		if (button == panel.selected)
		{
			color = panel.highlightColor;
			drawButton(button.name, panel.buffer);
		}
		else
		{
			drawButton(button.name, button.value());
		}
	}

	function drawButton(text, value)
	{
		var font = panel.font;
		var result = value;
		if (typeof value == NUMBER)
		{
			result = Math.round(value*precision)/precision;
		}
		drawText(text + result, x, y, font, color);
		y += panel.offsetY;
	}
}

function panelUpdate(panel)
{
    var x = panel.x;
    var y = panel.y;

    panel.highlighted = undefined;
	for (var i = 0; i < panel.button.length; i++)
	{
		var button = panel.button[i];
		var buttonY = y - panel.offsetY;
		var color = panel.color;

		if (mouseX > panel.x &&
			mouseX < panel.x + panel.width &&
			mouseY > buttonY &&
			mouseY < buttonY + panel.offsetY)
		{
			if (mouseLeftHeld)
			{
				panel.selected = button;
			}
			panel.highlighted = button;
		}
		y += panel.offsetY;
	}
}

function panelKeyCapture(panel, evt)
{
    if (panel.selected != undefined) {

        var key = evt.keyCode;
        if (key >= 96 && key <= 106)
        {
            var num = key-96;
            panel.buffer += num.toString();
        }
        if (key >= 48 && key <= 58)
        {
            var num = key-48;
            panel.buffer += num.toString();
        }
        if (key == 109 || key == 189)
        {
            panel.buffer += "-";
        }
        if (key == 110 || key == 190)
        {
            panel.buffer += ".";
        }
        if (key == 8)
        {
            panel.buffer = panel.buffer.slice(0, -1);
        }
        if (key == 13) {
            var number = Number(panel.buffer);
            if (!isNaN(number)) {
                panel.selected.value(number);
                panel.selected = undefined;
            }
            else
            {
                panel.selected = undefined;
            }
            panel.buffer = ""
        }
    }
}

function drawText(text, x, y, font, color)
{
    canvasContext.font = font;
    canvasContext.fillStyle = color;
    canvasContext.fillText(text, x, y);
}

function makePtr(varName) {
    return "(function(_val) {\n" +
        "    if (arguments.length > 0) " + varName + " = _val;\n" +
        "    return " + varName + ";\n" +
        "})";
}
