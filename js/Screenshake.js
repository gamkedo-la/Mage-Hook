// SCREENSHAKE - a simple html element wiggler for "juice"
// made for gamkedo with love from mcfunkypants

var screen_shakes = 0; // frames of screenshake used as player feedback for when we take damage
var screen_shake_pivot_x = 0;
var screen_shake_pivot_y = 0;
var screen_shake_me = document.getElementById('gameCanvas');
function screenshake(howmany)
{
	console.log('screenshake ' + howmany);
	if (!screen_shake_me)
	{
		console.log('ERROR: screenshake does not know which element to shake!')
		return;
	}
	screen_shake_pivot_x = 0;
	screen_shake_pivot_y = 0;
	screen_shakes += howmany;
}

function updateScreenshake()
{
	if (!screen_shake_me) return; // sanity check

	if (screen_shakes>0)
	{
		var shakesize = screen_shakes / 2;
		if (shakesize > 20) shakesize = 20;

		// shake around a pivot point
		screen_shake_me.style.margin = "" + (screen_shake_pivot_x + Math.round((Math.random() * shakesize) - shakesize / 2) * 2) + 
					"px " + (screen_shake_pivot_y + Math.round((Math.random() * shakesize) - shakesize / 2) * 2) + "px";

		screen_shakes--;
		//console.log('screen_shakes:'+screen_shakes);

		// about to finish? return to where we were when we started
		if (screen_shakes < 1)
		{
			//console.log('screenshakes done. going back to original position.')
			screen_shake_me.style.margin = "0";
		}
	}
}

function resetScreenShake(){
	screen_shakes = 0; // frames of screenshake used as player feedback for when we take damage
	screen_shake_pivot_x = 0;
	screen_shake_pivot_y = 0;
	screen_shake_me = document.getElementById('gameCanvas');
}
