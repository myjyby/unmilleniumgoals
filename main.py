#!/usr/bin/python2
import sys
sys.stdout = sys.stderr

import atexit
import threading

import os, os.path

import cherrypy
import pandas as pd


#cherrypy.config.update({'environment': 'embedded'})

cherrypy.config.update({'server.socket_port': 8090,
                        'engine.autoreload_on': False,
                        'log.access_file': '/tmp/unmillenium_access.log',
                        'log.error_file': '/tmp/unmillenium_error.log'})

print "Loading data"
data = pd.read_csv('data_final_02.csv.bz2',low_memory=False)
#store = pd.HDFStore('data_final_02.h5')
#data = store['table']
print "Done."

class Home(object):
	@cherrypy.expose
	def index(self):
		return open('index.html')

class RetrieveCountries(object):
	exposed = True

	@cherrypy.tools.accept(media='application/json')
	def POST(self, area=None):

		if area is not None:
			df = data[data["Region"] == area]

		else:
			df = data

		#group = df.groupby("CountryName")
		#unique_coutnries = group.first()
		#final_df = unique_coutnries[['Region','CountryId']]
		#final_df.reset_index(level=0,inplace=True)

		un = df.drop_duplicates(cols='CountryName', take_last=True)
		final_df = un[['CountryId','Region','CountryName']]

		return final_df.to_json(orient='records')

class RetrieveCountriesin1990(object):
	exposed = True

	@cherrypy.tools.accept(media='application/json')
	def POST(self, seriesId=None):

		copy_data = data
		filter1 = copy_data['SeriesRowId'] == int(seriesId)
		filter2 = copy_data['Year'] == 1990
		copy_data = copy_data[filter1 & filter2]
		
		#group = copy_data.groupby("CountryName")
		#unique_coutnries = group.first()
		#final_df = unique_coutnries[['Region','CountryId']]
		#final_df.reset_index(level=0,inplace=True)

		un = copy_data.drop_duplicates(cols='CountryName', take_last=True)
		final_df = un[['CountryId','Region','CountryName']]

		return final_df.to_json(orient='records')

class RetrieveIndicators(object):
	exposed = True

	@cherrypy.tools.accept(media='application/json')
	def POST(self, ids=None):

		if ids is not None:
			filters = map(int,ids)
			df = data[data['SeriesRowId'].isin(filters)]

		else:
			df = data

		#group = df.groupby('SeriesName')
		#unique_indicators = group.first()
		#final_df = unique_indicators[['GoalName','GoalId','TargetName','TargetId','IndicatorName','SeriesRowId','IsMdg','Disc-level']]
		#final_df.reset_index(level=0,inplace=True)

		un = df.drop_duplicates(cols='SeriesName', take_last=True)
		final_df = un[['SeriesName','GoalName','GoalId','TargetName','TargetId','IndicatorName','SeriesRowId','IsMdg','Disc-level']]
	
		return final_df.to_json(orient='records')

class RetrieveData(object):
	exposed = True

	@cherrypy.tools.accept(media='application/json')
	def POST(self, colname=None, subset_key=None, subset_value=None, isunique=None):
		#self.data = pd.read_csv('data_treated.csv')
		datajson = data
		
		if subset_key is not None and subset_value is not None:
			datajson = datajson[datajson[subset_key] == int(subset_value)]
		
		if colname is not None:
			datajson = datajson[colname]

		if isunique is not None:
			datajson = pd.unique(datajson).tolist()
			return datajson
			
		return datajson.to_json(orient='records')

class RetrieveUnique(object):
	exposed = True

	@cherrypy.tools.accept(media='text/plain')
	def POST(self, colname=None, subset_key=None, subset_value=None):
		datajson = data
		
		if subset_key is not None and subset_value is not None:
			datajson = datajson[datajson[subset_key] == subset_value]
		
		if colname is not None:
			datajson = datajson[datajson["Disc-level"] == 0]
			datajson = datajson[colname]

		datajson = pd.unique(datajson).tolist()

		#if datajson is not digit():
		return ',,,'.join(datajson)

		#else:
		#	return datajson
			
class RetrieveSeries(object):
	exposed = True

	@cherrypy.tools.accept(media='application/json')
	def POST(self, column=None, value=None, date=None, region=None, ctr=None):
		#import pdb
		#pdb.set_trace()
		filters = map(int,value)
		
		# NEED TO CHECK LENGTH OF value HERE BECAUSE E MAY HAVE FOUR ELEMENTS
		#if len(filters) > 2:
		if len(filters) == 4:
			xvals = filters[:2]
			yvals = filters[2:]
			dx = data[data[column].isin(xvals)]
			dy = data[data[column].isin(yvals)] 

		else:
			dx = data[data[column] == filters[0]] 
			dy = data[data[column] == filters[1]] 

		if region is not None:
			dx = dx[dx['Region'] == region]
			dy = dy[dy['Region'] == region]

		if ctr is not None:
			dx = dx[dx['CountryId'] == int(ctr)]
			dy = dy[dy['CountryId'] == int(ctr)]
		
		ddatex = dx[dx['Year'] == int(date)]
		dx['axis'] = 'x'
		ddatey = dy[dy['Year'] == int(date)]
		dy['axis'] = 'y'
		

		datajson = pd.concat([dx,dy])
		datajson['gx_min'] = dx['Value'].min()
		datajson['gx_max'] = dx['Value'].max()
		datajson['gy_min'] = dy['Value'].min()
		datajson['gy_max'] = dy['Value'].max()
		datajson['dx_min'] = ddatex['Value'].min()
		datajson['dx_max'] = ddatex['Value'].max()
		datajson['dy_min'] = ddatey['Value'].min()
		datajson['dy_max'] = ddatey['Value'].max()


		return datajson.to_json(orient='records');


if __name__ == '__main__':
	conf = {
		'/': {
			'tools.sessions.on': True,
			'tools.staticdir.root': os.path.abspath(os.getcwd())
		},
		'/retrievecountries': {
			'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
			'tools.response_headers.on': True,
			'tools.response_headers.headers': [('Content-Type', 'application/json')],
		},
		'/retrievecountriesin1990': {
			'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
			'tools.response_headers.on': True,
			'tools.response_headers.headers': [('Content-Type', 'application/json')],
		},
		'/retrieveindicators': {
			'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
			'tools.response_headers.on': True,
			'tools.response_headers.headers': [('Content-Type', 'application/json')],
		},
		'/retrievedata': {
			'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
			'tools.response_headers.on': True,
			'tools.response_headers.headers': [('Content-Type', 'application/json')],
		},
		'/retrieveunique': {
			'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
			'tools.response_headers.on': True,
			'tools.response_headers.headers': [('Content-Type', 'text/plain')],
		},
		'/retrieveseries': {
			'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
			'tools.response_headers.on': True,
			'tools.response_headers.headers': [('Content-Type', 'application/json')],
		},
		'/static': {
			'tools.staticdir.on': True,
			'tools.staticdir.dir': './static'
		}
	}

	webapp = Home()
	webapp.retrievecountries = RetrieveCountries()
	webapp.retrievecountriesin1990 = RetrieveCountriesin1990()
	webapp.retrieveindicators = RetrieveIndicators()
	webapp.retrievedata = RetrieveData()
	webapp.retrieveunique = RetrieveUnique()
	webapp.retrieveseries = RetrieveSeries()
	#cherrypy.quickstart(webapp, '/unmilleniumgoals', conf)
	cherrypy.quickstart(webapp, '/', conf)