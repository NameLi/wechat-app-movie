var app = getApp()

 Page({
  data: {
    actor: {}
  },

  onLoad: function (options) {
    app.setBarColor()
    
    this.getActor(options.id)
  },

  getActor: function (id) {

    app.http('casts/' + id + '?works=false').then(res => {

      var actor = res
      actor.summary = actor.summary.replace(/<br\/>/g, '\n')
      actor.summary = actor.summary.replace(/<br \/>/g, '\n')

      wx.setNavigationBarTitle({
        title: actor.name
      })

      this.setData({
        actor: actor
      })
    })
  }

})