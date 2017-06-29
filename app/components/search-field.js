import Ember from 'ember';

export default Ember.Component.extend({
  value: '',
  init(){
    this._super(...arguments);
    if(this.get('value').length > 0){
      this.send('handleSearch')
    }
  },
  actions: {
    handleSearch(){
      var value = this.get('value');
      var prefix = value.substring(0,4).toUpperCase();
      var bn = value.substring(4);
      Ember.$('.loadGif').css('visibility', 'visible');
      Ember.$.get('/api/search', {bn: bn, prefix: prefix}, (data)=>{
        data = JSON.parse(data).data;
        var blPattern = /B\/L Number: <b>(\w{12})<\/b><br \/>/g
        var originPattern = /Place of Receipt <b>(\w+)\s* \[\w{5}\]<\/b>/g
        var destinationPattern = /Place of Delivery <b>(\w+)\s* \[\w{5}\]<\/b>/g

        var containerRow = new RegExp(/<tr class="resultrow" .*?<\/tr>/, 'g')
        var containerNumber = /<td class="container-num"><b>(\w*)<\/b>/g
        var containerType = /<td class="container-type">(\d{2})(\w{2})<\/td>/g
        var vesselVoyage = /<td class="vessel-voyage"><br \/>([\w\s]+)<br \/>(\w+)<\/td>/g
        var arrival = /<td class="arrival-delivery"><br \/>2017-04-18<br \/>(\d{4})-(\d{2})-(\d{2})<\/td>/g

        var blNum = blPattern.exec(data.refnum_info)[1];
        var origin = originPattern.exec(data.scheduleinfo)[1];
        var destination = destinationPattern.exec(data.scheduleinfo)[1];
        var vv = vesselVoyage.exec(data.scheduletable);

        var date = arrival.exec(data.scheduletable);
        var monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"];
        var yr = date[1];
        var mnth = monthNames[Number(date[2])-1];
        var day = date[3];
        var fmtDate = `${mnth} ${day}, ${yr}`;

        const steamlines = {
          PABV: 'PIL'
        }

        var parsed = {
          'blNumber': blNum,
          'steamLine': steamlines[prefix],
          'Origin': origin.toLowerCase(),
          "Destination": destination.toLowerCase(),
          "Containers": [],
          "Vessel": vv[1],
          "Voyage": vv[2],
          "VesselETA": fmtDate,
          "url": "http://"+window.location.host+"/bookings/"+value
        }

        var match = containerRow.exec(data.containers);
        while (match != null){
          var st = containerType.exec(match[0])
          var container = {
            'Number': containerNumber.exec(match[0])[1],
            'Size': `${st[1]}'`,
            'Type': st[2]
          }
          parsed.Containers.push(container);
          match = containerRow.exec(data.containers);
        }
        this.set('results', parsed);
        Ember.$('.loadGif').css('visibility', 'hidden');
      })
    }
  }
});
