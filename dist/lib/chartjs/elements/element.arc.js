'use strict';

module.exports = function (Chart) {
	var helpers = Chart.helpers,
	    globalOpts = Chart.defaults.global;
	globalOpts.elements.arc = {
		backgroundColor: globalOpts.defaultColor,
		borderColor: '#ffffff',
		borderWidth: 2
	};
	Chart.elements.Arc = Chart.Element.extend({
		inLabelRange: function inLabelRange(mouseX) {
			var vm = this._view;
			if (vm) {
				return Math.pow(mouseX - vm.x, 2) < Math.pow(vm.radius + vm.hoverRadius, 2);
			}
			return false;
		},
		inRange: function inRange(chartX, chartY) {
			var vm = this._view;
			if (vm) {
				var pointRelativePosition = helpers.getAngleFromPoint(vm, {
					x: chartX,
					y: chartY
				}),
				    angle = pointRelativePosition.angle,
				    distance = pointRelativePosition.distance;
				// Sanitise angle range
				var startAngle = vm.startAngle;
				var endAngle = vm.endAngle;
				while (endAngle < startAngle) {
					endAngle += 2.0 * Math.PI;
				}
				while (angle > endAngle) {
					angle -= 2.0 * Math.PI;
				}
				while (angle < startAngle) {
					angle += 2.0 * Math.PI;
				}
				// Check if within the range of the open/close angle
				var betweenAngles = angle >= startAngle && angle <= endAngle,
				    withinRadius = distance >= vm.innerRadius && distance <= vm.outerRadius;
				return betweenAngles && withinRadius;
			}
			return false;
		},
		getCenterPoint: function getCenterPoint() {
			var vm = this._view;
			var halfAngle = (vm.startAngle + vm.endAngle) / 2;
			var halfRadius = (vm.innerRadius + vm.outerRadius) / 2;
			return {
				x: vm.x + Math.cos(halfAngle) * halfRadius,
				y: vm.y + Math.sin(halfAngle) * halfRadius
			};
		},
		getArea: function getArea() {
			var vm = this._view;
			return Math.PI * ((vm.endAngle - vm.startAngle) / (2 * Math.PI)) * (Math.pow(vm.outerRadius, 2) - Math.pow(vm.innerRadius, 2));
		},
		tooltipPosition: function tooltipPosition() {
			var vm = this._view;
			var centreAngle = vm.startAngle + (vm.endAngle - vm.startAngle) / 2,
			    rangeFromCentre = (vm.outerRadius - vm.innerRadius) / 2 + vm.innerRadius;
			return {
				x: vm.x + Math.cos(centreAngle) * rangeFromCentre,
				y: vm.y + Math.sin(centreAngle) * rangeFromCentre
			};
		},
		draw: function draw() {
			var ctx = this._chart.ctx,
			    vm = this._view,
			    sA = vm.startAngle,
			    eA = vm.endAngle;
			ctx.beginPath();
			ctx.arc(vm.x, vm.y, vm.outerRadius, sA, eA);
			ctx.arc(vm.x, vm.y, vm.innerRadius, eA, sA, true);
			ctx.closePath();
			ctx.setStrokeStyle(vm.borderColor);
			ctx.setLineWidth(vm.borderWidth);
			ctx.setFillStyle(vm.backgroundColor);
			ctx.fill();
			ctx.setLineJoin('bevel');
			if (vm.borderWidth) {
				ctx.stroke();
			}
		}
	});
};
//# sourceMappingURL=element.arc.js.map
