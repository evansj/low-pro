Remote = Behavior.create({
  initialize: function(options) {
    if (this.element.nodeName == 'FORM') new Remote.Form(this.element, options);
    else new Remote.Link(this.element, options);
  }
});

Remote.Base = {
  initialize : function(options) {
    this.options = Object.extend({
      evaluateScripts : true
    }, options || {});
  },
  _makeRequest : function(options) {
    if (options.update) new Ajax.Updater(options.update, options.url, options);
    else new Ajax.Request(options.url, options);
    return false;
  }
}

Remote.Link = Behavior.create(Remote.Base, {
  onclick : function() {
    var options = Object.extend({ url : this.element.href, method : 'get' }, this.options);
    return this._makeRequest(options);
  }
});


Remote.Form = Behavior.create(Remote.Base, {
  onclick : function(e) {
    var sourceElement = e.element();
    
    if (sourceElement.nodeName.toLowerCase() == 'input' && 
        sourceElement.type == 'submit')
      this._submitButton = sourceElement;
  },
  onsubmit : function() {
    var options = Object.extend({
      url : this.element.action,
      method : this.element.method || 'get',
      parameters : this.element.serialize({ submit: this._submitButton.name })
    }, this.options);
    this._submitButton = null;
    return this._makeRequest(options);
  }
});

Observed = Behavior.create({
  initialize : function(callback, options) {
    this.callback = callback.bind(this);
    this.options = options || {};
    this.observer = (this.element.nodeName == 'FORM') ? this._observeForm() : this._observeField();
  },
  stop: function() {
    this.observer.stop();
  },
  _observeForm: function() {
    return (this.options.frequency) ? new Form.Observer(this.element, this.options.frequency, this.callback) :
                                      new Form.EventObserver(this.element, this.callback);
  },
  _observeField: function() {
    return (this.options.frequency) ? new Form.Element.Observer(this.element, this.options.frequency, this.callback) :
                                      new Form.Element.EventObserver(this.element, this.callback);
  }
});