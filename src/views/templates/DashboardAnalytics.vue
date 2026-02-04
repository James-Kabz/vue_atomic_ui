<script setup>
import { computed, ref } from 'vue'
import BarChart from '../../components/charts/BarChart.vue'
import Button from '../../components/Button.vue'
import Card from '../../components/Card.vue'
import Graph from '../../components/Graph.vue'
import GraphFilters from '../../components/GraphFilters.vue'
import LineChart from '../../components/charts/LineChart.vue'
import DashboardShell from './DashboardShell.vue'

const dateFrom = ref('')
const dateTo = ref('')
const dataSource = ref('')

const chartSources = [
  { label: 'Core Platform', value: 'core' },
  { label: 'Integrations', value: 'integrations' },
  { label: 'Manual Uploads', value: 'manual' }
]

const weeklyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const weeklyScore = [32, 38, 28, 44, 49, 52, 47]

const barLabels = ['APAC', 'EMEA', 'LATAM', 'NA']
const barData = [12, 19, 9, 22]

const trendSummary = computed(() => {
  const recent = weeklyScore[weeklyScore.length - 1]
  const prior = weeklyScore[weeklyScore.length - 2]
  const delta = prior ? ((recent - prior) / prior) * 100 : 0
  return {
    value: delta.toFixed(1),
    direction: delta >= 0 ? 'up' : 'down'
  }
})
</script>

<template>
  <DashboardShell current-page="Analytics">
    <div class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900">Analytics</h1>
          <p class="text-slate-600 mt-1">
            Monitor risk scoring, review throughput, and regional trends.
          </p>
        </div>
        <Button variant="secondary">Download Report</Button>
      </div>

      <GraphFilters
        :data-sources="chartSources"
        show-export
        @update:dateFrom="(value) => (dateFrom = value)"
        @update:dateTo="(value) => (dateTo = value)"
        @update:dataSource="(value) => (dataSource = value)"
        @export="() => {}"
      />

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card title="Weekly Risk Score" variant="elevated" padding="lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-3xl font-semibold text-slate-900">{{ weeklyScore[weeklyScore.length - 1] }}</p>
              <p class="text-sm text-slate-500">Rolling average</p>
            </div>
            <div
              class="px-3 py-1 rounded-full text-xs font-semibold"
              :class="trendSummary.direction === 'up' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'"
            >
              {{ trendSummary.direction === 'up' ? '+' : '' }}{{ trendSummary.value }}%
            </div>
          </div>
        </Card>
        <Card title="Filters" variant="outlined" padding="lg">
          <div class="space-y-2 text-sm text-slate-600">
            <p>Date range: {{ dateFrom || 'Any' }} - {{ dateTo || 'Any' }}</p>
            <p>Source: {{ dataSource || 'All sources' }}</p>
            <p>Segments: 4 active cohorts</p>
          </div>
        </Card>
        <Card title="Upcoming Reviews" variant="outlined" padding="lg">
          <div class="space-y-3">
            <div class="rounded-lg border border-slate-200 p-3">
              <p class="text-sm font-semibold text-slate-900">Vendor renewal cycle</p>
              <p class="text-xs text-slate-500">Due in 5 days</p>
            </div>
            <div class="rounded-lg border border-slate-200 p-3">
              <p class="text-sm font-semibold text-slate-900">Quarterly policy review</p>
              <p class="text-xs text-slate-500">Due in 2 weeks</p>
            </div>
          </div>
        </Card>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Graph
          title="Daily Risk Score"
          description="Momentum across the past week"
          variant="elevated"
        >
          <LineChart
            :data="weeklyScore"
            :labels="weeklyLabels"
            :width="520"
            :height="280"
          />
        </Graph>

        <Graph
          title="Regional Escalations"
          description="Escalations per region"
          variant="elevated"
        >
          <BarChart
            :data="barData"
            :labels="barLabels"
            :width="520"
            :height="280"
          />
        </Graph>
      </div>
    </div>
  </DashboardShell>
</template>
