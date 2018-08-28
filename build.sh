#!/bin/bash

now=`date +%Y%m%d_%H%M%S`
zip1="../../build_${now}.zip"
zip1b="../../build_${now}_advzip.zip"
shave="no"

mkdir -p ./build/stage1

cd ./build/stage1

{
	echo "\"use strict\";"
	
	filenames=`cat ../../src/index.html | grep -Eo '<script type="text/javascript" src="[^"]+"' | cut -d \" -f 4 | grep -vE '3rdparty'`
	
	for a in $filenames; do
		cat "../../src/$a"
	done | grep -vE '^\"use strict'
} > a.js

cp a.js b.js

if [ "$shave" == "yes" ]; then
	vars="endPattern env_attack env_master env_release env_sustain fx_delay_amt fx_delay_time fx_filter fx_freq fx_pan_amt fx_pan_freq fx_resonance lfo_amt lfo_freq lfo_fx_freq lfo_osc1_freq lfo_waveform noise_fader osc1_det osc1_detune osc1_oct osc1_vol osc1_waveform osc1_xenv osc2_det osc2_detune osc2_oct osc2_vol osc2_waveform osc2_xenv rowLen songData songLen"
	i=0
	for a in $vars; do
		b="b${i}"
		
		mv b.js b.js.tmp
		
		cat b.js.tmp | sed -r "s/\"$a\"/\"$b\"/g" > b.js
		
		i=$((i + 1))
	done
fi

java -jar ../compiler/compiler.jar \
	--compilation_level ADVANCED_OPTIMIZATIONS \
	--externs ../../src/3rdparty/babylon.ext.js \
	--js b.js \
	--js_output_file c.js \
	--logging_level FINEST \
	--warning_level VERBOSE \
	--formatting SINGLE_QUOTES \
	--summary_detail_level 3

cat ../../src/index.min.html | sed \
	-e '/<!-- insert minified javascript here -->/{' \
	-e 'i <script>' \
	-e 'r c.js' \
	-e 'a </script>' \
	-e 'd}' \
	> index.html

cp index.html index.html.1
cat index.html.1 | tr -d '\r' | tr '\n' ' ' > index.html

zip -9 $zip1 index.html

cp $zip1 $zip1b
if [ "$shave" == "yes" ]; then
	../advancecomp/advancecomp-1.20/advzip -z -4 -i 50000 $zip1b
else
	../advancecomp/advancecomp-1.20/advzip -z -4 -i 500 $zip1b
fi

ls -albtr * $zip1 $zip1b

bytes=`stat --format '%s' $zip1b`
bytes_limit=13312

if [ $bytes -gt $bytes_limit ]; then
	echo "FAILED: final ZIP is too big."
	exit 1
fi

percent=$((100 * $bytes / $bytes_limit))

echo "Used: $percent% ($bytes/$bytes_limit)"
