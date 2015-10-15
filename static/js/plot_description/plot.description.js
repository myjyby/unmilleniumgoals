function parseToText(arr)
{
    var arr_len = arr.length;
    var parsedText = ''
    if (arr_len <= 1) // this will never be 0 as the function is only called if the length > 0
    {
        if (arr[0] < 0)
        {
            parsedText = 'The curve increases, and then decreases.';
        }
        else if (arr[0] == 0)
        {
            // add boundary information here to bring the context.
            parsedText = 'The curve flattens out a bit without changing the direction.';
        }
        else
        {
            parsedText = 'The curve decreases, and then increases.';
        }
    }
    
    else // now this will always be > 1
    {
        for (j = 0; j < arr_len; j++)
        {
            // first add the start statement.
            if (j == 0)
            {
                if (arr[j] < 0)
                {
                    parsedText = 'The curve increases then decreases, ';
                }
                else if (arr[j] == 0)
                {
                    // add boundary information here to bring the context.
                    parsedText = 'The curve flattens out in between without changing the direction, ';
                }
                else
                {
                    parsedText = 'The curve decreases then increases, ';
                }
            }
            
            // add the end statement
            else if (j == arr_len - 1)
            {
                if (arr[j] < 0)
                {
                    parsedText = parsedText+'and finally, the curve decreases again.';
                }
                else if (arr[j] == 0)
                {
                    // add boundary information here to bring the context.
                    parsedText = parsedText+'and finally, the curve flattens out in between without changing the direction.';
                }
                else
                {
                    parsedText = parsedText+'and finally, the curve increases again.';
                }
            }
            
            else // this is where the rest of the logic goes
            {
                if (arr[j] < 0)
                {
                    parsedText = parsedText+'next, it decreases, ';
                }
                else if (arr[j] == 0)
                {
                    // add boundary information here to bring the context.
                    parsedText = parsedText+'then the curve flattens out in between without changing the direction, ';
                }
                else
                {
                    parsedText = parsedText+'next, it increases, ';
                }
            }
        }
    }
    return parsedText;
}
    
/*function get_last(fn,xmin,xmax,targYear)
{
    var trend = 0;
    var previousX = xmin;
    Array.prototype.contains = function(v) {
        for(var i = 0; i < this.length; i++) {
            if(Math.round(this[i]*10000000)/10000000 === Math.round(v*1000000)/1000000) return true; // checks for value upto 7 decimal places.
        }
        return false;
    };
    Array.prototype.unique = function() {
        var arr = [];
        for(var i = 0; i < this.length; i++) {
            //console.log(this[i]);
            if(!arr.contains(this[i])) {
                arr.push(this[i]);
            }
        }
        return arr; 
    }
    var df_1 = nerdamer('diff('+fn+',x)').toString();
    var temp_sols = nerdamer.solveEquations(df_1+'=0','x');
    //console.log('all roots: '+temp_sols.toString());
    var sols = temp_sols.unique(); // only unique roots
    sols.sort( function(a,b) {
        return a-b;
    }); // sorting needed to retain the sequence.
    //console.log('unique and sorted roots: '+sols.toString()+'length:'+sols.length);
    var final_sols = [];
    
    for (var i = 0; i < sols.length; i++)
    {
        //console.log(sols[i].multiplier);
        if((sols[i].multiplier >= xmin) && (sols[i].multiplier <= xmax))
        {
            final_sols.push(sols[i].multiplier);
        }
    }
    
    var num_sols = final_sols.length;
    ////console.log(final_sols);
    if (num_sols > 0)
    {
        previousX = final_sols[num_sols-1];
    }

   //console.log(final_sols)
    
    var maxmins = [];
    var description = '';
    for (i = 0; i < num_sols; i ++)
    {
        var df_2 = nerdamer('diff('+df_1+',x)').text();
        if (final_sols[i].toString().search('i') == -1) // checking for complex roots
        {
            var temp_result = nerdamer(df_2).evaluate({x:final_sols[i]});
            maxmins.push(temp_result)
        }
    }
    
    if (maxmins.length > 0)
    {
        if (maxmins[maxmins.length-1] < 0)
        {
            description = "decreased";
            trend = -1;
        }
        else if (maxmins[maxmins.length-1] > 0)
        {
            description = "increased";
            trend = 1;
        }
        else
        {
            description = "been stable";
            trend = 0;
        }
        predict_val = nerdamer(fn).evaluate({x:targYear});
    }
    else
    {
        var ymin = nerdamer(fn).evaluate({x:xmin});
        var ymax = nerdamer(fn).evaluate({x:xmax});
        
        predict_val = ymin + (targYear-xmin)*((ymax-ymin)/(xmax-xmin))
        
        if (ymin < ymax)
        {
            description = "consistently increased";
            trend = 1;
        }
        else if (ymin > ymax)
        {
            description = "consistently decreased";
            trend = -1;
        }
        else
        {
            description = "been stable";
            trend = 0;
        }
    }

    //alert([trend,predict_val]);
    previousX = Math.round(previousX) + 1990;
    return [trend,predict_val,description,previousX];
     
}*/

function get_last(fn,xmin,xmax,targYear)
{
    var trend = 0;
    var previousX = xmin;
    Array.prototype.contains = function(v) {
        for(var i = 0; i < this.length; i++) {
            if(Math.round(this[i]*10000000)/10000000 === Math.round(v*1000000)/1000000) return true; // checks for value upto 7 decimal places.
        }
        return false;
    };

    Array.prototype.unique = function() {
        var arr = [];
        for(var i = 0; i < this.length; i++) {
            //console.log(this[i]);
            if(!arr.contains(this[i])) {
                arr.push(this[i]);
            }
        }
        return arr; 
    }

    var df_1 = nerdamer('diff('+fn+',x)').toString();
    var temp_sols = nerdamer.solveEquations(df_1+'=0','x');
    //console.log('all roots: '+temp_sols.toString());
    var sols = temp_sols.unique(); // only unique roots
    sols.sort( function(a,b) {
        return a-b;
    }); // sorting needed to retain the sequence.
    //console.log('unique and sorted roots: '+sols.toString()+'length:'+sols.length);
    var final_sols = [];
    
    if ((sols.length > 0) && (sols[0].value === "#"))
    {
        for (var i = 0; i < sols.length; i++)
        {
            //console.log("testing");
            if((sols[i].multiplier >= xmin) && (sols[i].multiplier <= xmax))
            {
                final_sols.push(sols[i].multiplier);
            }
        }
    }
    
    var num_sols = final_sols.length;
    if (num_sols > 0)
    {
        previousX = final_sols[num_sols-1];
    }
    
    //console.log(final_sols);
    var maxmins = [];
    var description = '';
    for (i = 0; i < num_sols; i ++)
    {
        var df_2 = nerdamer('diff('+df_1+',x)').text();
        if (final_sols[i].toString().search('i') == -1) // checking for complex roots
        {
            var temp_result = nerdamer(df_2).evaluate({x:final_sols[i]});
            maxmins.push(temp_result)
        }
    }
    
    if (maxmins.length > 0)
    {
        if (maxmins[maxmins.length-1] < 0)
        {
            //alert("decrease");
             description = "decreased";
            trend = -1;
        }
        else if (maxmins[maxmins.length-1] > 0)
        {
            //alert("increase");
             description = "increased";
            trend = 1;
        }
        else
        {
            //alert("stable");
             description = "been stable";
            trend = 0;
        }
        predict_val = nerdamer(fn).evaluate({x:targYear});
    }
    else
    {
        var ymin = nerdamer(fn).evaluate({x:xmin});
        var ymax = nerdamer(fn).evaluate({x:xmax});
        
        predict_val = ymin + (targYear-xmin)*((ymax-ymin)/(xmax-xmin))
        
        if (ymin < ymax)
        {
            //alert("consistent increase");
             description = "consistently increased";
            trend = 1;
        }
        else if (ymin > ymax)
        {
            //alert("consistent decrease");
             description = "consistently decreased";
            trend = -1;
        }
        else
        {
            //alert("stable");
             description = "remained stable";
            trend = 0;
        }
    }
    //alert([trend,predict_val,previousX]);
    //return [trend,predict_val,previousX];
    previousX = Math.ceil(previousX) + 1990;
    return [trend,predict_val,description,previousX];
     
}
    
function get_all(fn,xmin,xmax)
{
    Array.prototype.contains = function(v) {
        for(var i = 0; i < this.length; i++) {
            if(Math.round(this[i]*10000000)/10000000 === Math.round(v*1000000)/1000000) return true; // checks for value upto 7 decimal places.
        }
        return false;
    };
    Array.prototype.unique = function() {
        var arr = [];
        for(var i = 0; i < this.length; i++) {
            //console.log(this[i]);
            if(!arr.contains(this[i])) {
                arr.push(this[i]);
            }
        }
        return arr; 
    }
    var df_1 = nerdamer('diff('+fn+',x)').toString();
    var temp_sols = nerdamer.solveEquations(df_1+'=0','x');
    //console.log('all roots: '+temp_sols.toString());
    var sols = temp_sols.unique(); // only unique roots
    sols.sort( function(a,b) {
        return a-b;
    }); // sorting needed to retain the sequence.
    //console.log('unique and sorted roots: '+sols.toString()+'length:'+sols.length);
    var final_sols = [];
    
    for (var i = 0; i < sols.length; i++)
    {
        //console.log(sols[i].multiplier);
        if((sols[i].multiplier >= xmin) && (sols[i].multiplier <= xmax))
        {
            final_sols.push(sols[i].multiplier);
        }
    }
    
    var num_sols = final_sols.length;
    //console.log(final_sols);
    var maxmins = [];
    var description = '';
    for (i = 0; i < num_sols; i ++)
    {
        var df_2 = nerdamer('diff('+df_1+',x)').text();
        if (final_sols[i].toString().search('i') == -1) // checking for complex roots
        {
            var temp_result = nerdamer(df_2).evaluate({x:final_sols[i]});
            maxmins.push(temp_result)
        }
    }
    
    //console.log('only values from non-complex, unique and sorted roots :'+maxmins);
    if (maxmins.length > 0)
    {
        description = parseToText(maxmins);
    }
    else
    {
        // add the boundary condition logic here
        var ymin = nerdamer(fn).evaluate({x:xmin});
        var ymax = nerdamer(fn).evaluate({x:xmax});
        if (ymin < ymax)
        {
            description = "consistent increase";
        }
        else if (ymin > ymax)
        {
            description = "consistent decrease";
        }
        else
        {
            description = "stable";
        }
    }
    alert("description: "+description);
}