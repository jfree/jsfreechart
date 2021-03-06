module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
	    pkg: grunt.file.readJSON('package.json'),

	    concat: {
		options: {
		    stripBanners: true
		},
                dist: {
		    src: [
			  'public_html/src/JSFreeChart.js',
			  'public_html/src/Utils.js',
              'public_html/src/Args.js',
              'public_html/src/util/*.js',
              'public_html/src/graphics/RefPt2D.js',
              'public_html/src/graphics/Anchor2D.js',
              'public_html/src/graphics/Shape.js',
              'public_html/src/graphics/Circle.js',
              'public_html/src/graphics/Color.js',
              'public_html/src/graphics/Font.js',
              'public_html/src/graphics/*.js',
              'public_html/src/Colors.js',
              'public_html/src/table/*.js',
              'public_html/src/data/*.js',
              'public_html/src/Charts.js',
              'public_html/src/Chart.js',
              'public_html/src/ChartManager.js',
              'public_html/src/legend/LegendBuilder.js',
              'public_html/src/legend/StandardLegendBuilder.js',
              'public_html/src/legend/FixedLegendBuilder.js',
              'public_html/src/legend/LegendItemInfo.js',
			  'public_html/src/axis/ValueAxis.js',
			  'public_html/src/axis/CategoryAxis.js',
			  'public_html/src/axis/StandardCategoryAxis.js',
			  'public_html/src/axis/AxisSpace.js',
			  'public_html/src/axis/BaseValueAxis.js',
			  'public_html/src/axis/Crosshair.js',
			  'public_html/src/axis/LabelOrientation.js',
			  'public_html/src/axis/NumberTickSelector.js',
			  'public_html/src/axis/LinearAxis.js',
			  'public_html/src/axis/TickMark.js',
              'public_html/src/axis/*.js',
              'public_html/src/renderer/ColorSource.js',
              'public_html/src/renderer/category/CategoryRenderer.js',
			  'public_html/src/renderer/category/BaseCategoryRenderer.js',
			  'public_html/src/renderer/category/BarRenderer.js',
			  'public_html/src/renderer/category/StackedBarRenderer.js',
			  'public_html/src/renderer/StrokeSource.js',
              'public_html/src/renderer/*.js',
              'public_html/src/plot/*.js',
              'public_html/src/interaction/Modifier.js',
              'public_html/src/interaction/*.js',
              'public_html/src/labels/*.js',
              'public_html/src/Module.js'
			  ],
		    dest: 'public_html/lib/jsfreechart.js',
		}
	    },
	    uglify: {
		build: {
		    src: 'public_html/lib/jsfreechart.js',
		    dest: 'public_html/lib/jsfreechart.min.js',
		    options: {
			mangle: true
		    }
		}
	    },
	    jasmine_node: {
	        options: {
	          forceExit: true,
	          match: '.',
	          matchall: false,
	          extensions: 'js',
	          specNameMatcher: 'spec',
	          jUnit: {
	            report: true,
	            savePath : "./build/reports/jasmine/",
	            useDotNotation: true,
	            consolidate: true
	          }
	        },
	        all: ['public_html/spec/']
	      }
	});

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jasmine-node');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['concat', 'uglify', 'jasmine_node']);
    grunt.registerTask('build', ['concat', 'uglify']);
    grunt.registerTask('test', ['jasmine_node']);

};