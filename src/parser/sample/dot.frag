//https://www.shadertoy.com/view/llyyDG
#define PI acos(-1.)
const float RADIUS = .1;
const float SIZE = 7.;
const float BLURSTEPS = 30.;
const float SPEED = 1.5;
const bool SQUARE = false;
const bool RING = true;
const float RINGRADIUS = .2;
const float RINGTHICKNESS = .025;
const bool SMOOTH = true;
const bool RIPPLE = false;
const float RIPPLESCALE = .2;

vec2 rotate(vec2 p,float a)
{
    return cos(a)*p+sin(a)*vec2(-p.y,p.x);
}

float noise(float x)
{
    return fract(x*7.3737);
}

float tick(float t)
{
    if (SMOOTH)
    {
    	// multiple smoothsteps to get a more snappy motion
    	t = smoothstep(0.,1.,t);
    	t = smoothstep(0.,1.,t);
    }
    return t;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.xy-.5;
    uv.x *= iResolution.x / iResolution.y;
    uv *= SIZE;
    
    float time = iTime * SPEED;
    
    if (RIPPLE)
    {
    	time -= length(uv)*RIPPLESCALE;
    }

    float color = 0.;
    
    vec2 baseUV = uv;
    for (float i = 0.; i < BLURSTEPS; ++i)
    {
        // offset time by a fraction of a frame
        time += (SPEED/BLURSTEPS)/60.;
        
        uv = baseUV;
        vec2 cell = floor(uv+.5);

        float t = tick(fract(time));

        float mode = noise(floor(time))*7.;
        float dir = step(.01,mod(mode,.02))*2.-1.;
        t *= dir;
        
        if (mode < 1.)
        {
            // vertical shear
            uv.y += cell.x * t;
        }
        else if (mode < 2.)
        {
            // horizontal shear
            uv.x += cell.y * t;
        }
        else if (mode < 3.)
        {
            // rotate
            uv = rotate(uv, t*PI*.5);
        }
        else if (mode < 4.)
        {
            // vertical interleaving
            uv.y += (mod(cell.x,2.)*2.-1.) * t;
        }
        else if (mode < 5.)
        {
            // horizontal interleaving
            uv.x += (mod(cell.y,2.)*2.-1.) * t;
        }
        else if (mode < 6.)
        {
            // vertical translation
			uv.y += t;
        }
        else if (mode < 7.)
        {
            // horizontal translation
			uv.x += t;
        }

        // modulo space to get the grid
        uv = fract(uv+.5)-.5;

        // signed distance
        float d = 0.;
        if (RING)
        {
            d = RINGTHICKNESS-abs(length(uv)-RINGRADIUS);
        }
        else
        {
			d = RADIUS-length(uv);
        }
        
        // smoothed edge
        color += smoothstep(.0,2.*SIZE/iResolution.y,d);
    }
    
    // divide to account for multiple blur samples
    color /= BLURSTEPS;
    
    // gamma correction
    color = pow(color, .45);
    
    // cull the sides with a soft falloff
    if (SQUARE)
    {
    	color *= smoothstep(SIZE*.5+.25,SIZE*.5-.25,max(baseUV.x,-baseUV.x));
    }
    
    fragColor = vec4(color);
}