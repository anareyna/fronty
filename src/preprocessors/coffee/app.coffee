App = (->
	dom = {}
	st =
		body: "body"

	catchDom = ->
		dom.body = $(st.body)
		return

	subscribeEvents = ->
		dom.body.on "click", events.myEvent
		return

	events =
		myEvent: ->
			dom.body.css "background-color", "deeppink"
			return

	functions =
		myFunction: ->
			console.log 'test'
			return

	initialize = ->
		catchDom()
		subscribeEvents()
		return

	init: initialize
)()
App.init()
