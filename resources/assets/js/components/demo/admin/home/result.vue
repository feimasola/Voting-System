<template>
<div class="row">
	<div class="col-md-4">
		<h4>Positions</h4><hr/>
		<ul class="list-group">
			<router-link :key="position.id" v-for="position in data.positions" class="list-group-item" :class="{'active':position.id==position_id}" tag="li" :to="{query:{position_id:position.id}}" exact replace>
				{{ position.name }}
			</router-link>
			<li class="list-group-item">
				<center>
					<button class="btn btn-info" @click="refreshNominees()">
						Refresh results <i class="fa fa-refresh"></i>
					</button>
				</center>
			</li>
		</ul>
	</div>
	<div class="col-md-8">
		<h4>Results</h4><hr/>
		<div class="panel panel-default">
			<div class="panel-heading">{{ getPosition(position_id) }} - Results as of : {{ last_update }}</div>
			<div class="panel-body">
				<div id="barchart" style="height: 500px; width: 600px;"></div>
			</div>
			</div>
		</div>
	</div>
</div>
</template>

<style>
.inline {
    display: inline-block;
    vertical-align: middle;
    }
</style>

<script>
export default{

	created: function () {	
		console.log(this)
		this.refreshNominees();
		this.$nextTick(function(){
			this.initChart();
		});
	},

	watch: {
		position_id	: function () {
			this.initChart();
		}
	},

	methods: {
		refreshNominees: function () {
			var vm = this;
			this.util.notify('Refreshing results', 'loading');
			axios.get(config.API+'nominee')
				.then(response=>{
					$.notifyClose();
					vm.data.nominees = response.data;
					vm.refreshResults();
				})
				.catch(error=>{
					$.notifyClose();
					vm.util.showResult(error);
				})
		},

		refreshResults: function () {
			var vm = this;
			this.util.notify('Refreshing results', 'loading');
			axios.get(config.API+'election/results')
				.then(response=>{
					$.notifyClose();
					vm.data.results = response.data;
					vm.data.last_update= new Date();
					vm.initChart();
				})
				.catch(error=>{
					$.notifyClose();
					vm.util.showResult(error);
				})
		},

		initChart: function () {
		var ticks = [];
		var tick = 0;
		var data = [];
		var nominees = this.data.nominees;
					for (var i in nominees) {
                if (nominees[i]['position_id']== this.position_id){
                ticks.push([tick++, nominees[i]['name']]);
				}


        			}
			$.plot($('#barchart'), this.bars, {
				series: {
					bars: {
						show: true,
                        barWidth: 0.6,
                        align: "center",
                        fill: 0.75,
                        numbers:{show:true,
                        Formatter: function(label, series) {
                                                      var percent= Math.round(series.percent);
                                                      var number= series.data[0][1];
                                                      return('</b>:&nbsp;'+ number);
                                                  }
                        }
					}
				},
                 xaxis: {
                    ticks: ticks,
                    mode: "categories",
                          showTicks: false,
                          gridLines: false,
                          panRange: [0,null],
                 },
                     yaxis: {
                         minTickSize: 1,
                         tickDecimals: 0
                     },
                 legend:{
                 show: true,
                 labelFormatter: function(label, series) {
                                                      var percent= Math.round(series.percent);
                                                      var number= series.data[0][1];
                                                      return('&nbsp;<b>'+label+'</b>:&nbsp;'+ number);
                                                  }
                 },
                 valueLabels: {
                                 show: true
                             }


			})
		},

		getPosition: function (id) {
			let positions = this.data.positions;
			for (var i in positions)
				if (id == positions[i]['id']) return positions[i]['name'];
			return '';
		},

		getNominee: function (id) {
			let nominees = this.data.nominees;
			for (var i in nominees)
				if (id == nominees[i]['id']) return nominees[i]['name'];
			return '';
		},

		getVotes: function (id) {
			let results = this.data.results;
			for (var i in results) {
				if (results[i]['nominee_id'] == id) return results[i]['votes'];
			}
			return 0;
		}
	},

	computed: {
		last_update: function () {
			let x = this.data.last_update;
			return x.toDateString() +' '+x.toLocaleTimeString();
		},

		position_id: function () {
			return this.$route.query.position_id ?
						this.$route.query.position_id :
						this.data.positions[0]['id']; 
		},

		datas: function () {
			//var results =
			var data = [];
			var nominees = this.data.nominees;
			for (var i in nominees) {
				if (nominees[i]['position_id']== this.position_id){
					let row = [];
					row['label'] = nominees[i]['name'];
					row['data'] = [[1, this.getVotes(nominees[i]['id'])]];
					data.push(row);
				}
			}
			return data;
		},

		bars: function () {
			//var results =
			var data = [];
			var inc = 0;
			var tick = 0;
			var nominees = this.data.nominees;
			for (var i in nominees) {
				if (nominees[i]['position_id']== this.position_id){
					let row = [];
					row['label'] = nominees[i]['name'];
					row['data'] = [[inc++, this.getVotes(nominees[i]['id'])]];
					row['ticks'] = [[tick++, nominees[i]['name']]];
					data.push(row);
				}
			}
			return data;
		},
		tickss: function () {
			//var results =
			var data = [];
			var tick = 0;
			var nominees = this.data.nominees;
			for (var i in nominees) {
				if (nominees[i]['position_id']== this.position_id){
					let row = [];
					row['ticks'] = [[tick++, nominees[i]['name']]];
					data.push(row);
				}
			}
			return data;
		},
	}
}
</script>
