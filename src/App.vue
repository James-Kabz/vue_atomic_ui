<template>
  <div class="min-h-screen bg-background p-8">
    <div class="max-w-4xl mx-auto space-y-8">
      <div class="text-center space-y-4">
        <h1 class="text-4xl font-bold text-foreground">Vue UI Component Library</h1>
        <p class="text-muted-foreground">A collection of reusable Vue components built with Tailwind CSS</p>
      </div>

      <!-- Buttons -->
      <section class="space-y-4">
        <h2 class="text-2xl font-semibold">Buttons</h2>
        <div class="flex flex-wrap gap-4">
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      <!-- Inputs -->
      <section class="space-y-4">
        <h2 class="text-2xl font-semibold">Inputs</h2>
        <div class="space-y-4 max-w-md">
          <Input placeholder="Enter text..." />
          <Input type="email" placeholder="Enter email..." />
          <Input disabled placeholder="Disabled input" />
        </div>
      </section>

      <!-- Cards -->
      <section class="space-y-4">
        <h2 class="text-2xl font-semibold">Cards</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-muted-foreground">This is a card component with header and content.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Another Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-muted-foreground">Cards are great for organizing content.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <!-- Badges -->
      <section class="space-y-4">
        <h2 class="text-2xl font-semibold">Badges</h2>
        <div class="flex flex-wrap gap-4">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>
      <Calendar v-model="pickedDate" />

      <Timeline orientation="vertical">
        <TimelineItem title="Project Started" subtitle="Jan 2025">
          <p>Initial planning and setup of repositories.</p>
        </TimelineItem>

        <TimelineItem title="MVP Launch" subtitle="Mar 2025">
          <p>Released the first working version to internal users.</p>
        </TimelineItem>

        <TimelineItem title="Public Release" subtitle="Jun 2025">
          <p>Rolled out to all customers with major improvements.</p>
        </TimelineItem>
      </Timeline>

      <!-- Alerts -->
      <section class="space-y-4">
        <h2 class="text-2xl font-semibold">Alerts</h2>
        <div class="space-y-4">
          <Alert>
            <div class="font-medium">Default Alert</div>
            <div class="text-sm text-muted-foreground mt-1">This is a default alert message.</div>
          </Alert>
          <Alert variant="destructive">
            <div class="font-medium">Destructive Alert</div>
            <div class="text-sm mt-1">This is a destructive alert message.</div>
          </Alert>
        </div>
      </section>


      <div class="max-w-2xl mx-auto p-4">
        <h2 class="text-lg font-semibold mb-4">Stepper Example</h2>

        <Stepper>
          <StepperItem :step="1" title="Account" description="Create your account" completed />
          <StepperItem :step="2" title="Profile" description="Fill in personal details" active />
          <StepperItem :step="3" title="Confirm" description="Review & submit" />
        </Stepper>

        <div class="max-w-lg mx-auto p-4">
          <h2 class="text-lg font-semibold mb-4">Tabs Example</h2>

          <Tab>
            <TabPanel label="Overview">
              <p class="text-slate-600">Welcome to the overview section.</p>
            </TabPanel>

            <TabPanel label="Details">
              <p class="text-slate-600">Here you can see more details.</p>
            </TabPanel>

            <TabPanel label="Settings">
              <p class="text-slate-600">Adjust your settings here.</p>
            </TabPanel>
          </Tab>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from './components/Button.vue'
import Input from './components/Input.vue'
import Card from './components/Card.vue'
import CardHeader from './components/CardHeader.vue'
import CardTitle from './components/CardTitle.vue'
import CardContent from './components/CardContent.vue'
import Badge from './components/Badge.vue'
import Alert from './components/Alert.vue'
import Calendar from './components/Calendar.vue'
import { ref } from 'vue'
import { Timeline } from '.'
import TimelineItem from './components/TimelineItem.vue'
import Stepper from './components/Stepper.vue'
import StepperItem from './components/StepperItem.vue'
import TabPanel from './components/TabPanel.vue'
import Tab from './components/Tab.vue'

const pickedDate = ref(null)
</script>
