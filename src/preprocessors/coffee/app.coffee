App = (->
	dom = {}
	st =
		body: "h1"
	catchDom = ->
		dom.body = $(st.body)

	subscribeEvents = ->
		dom.body.on "click", events.myFunction
		return

	events =
		myFunction: ->
			dom.body.css 'background', 'red'
			return

	functions = {}
	initialize = ->
		catchDom()
		subscribeEvents()

	init: initialize
)()
App.init()