<script setup>
const sections = [
  {
    title: 'Getting Started',
    links: [{ to: '/components/getting-started', label: 'Overview' }]
  },
  {
    title: 'Installation',
    links: [{ to: '/components/installation', label: 'Packages and Setup' }]
  },
  {
    title: 'Theming',
    links: [{ to: '/components/theming', label: 'Theme Guide' }]
  },
  {
    title: 'Components',
    links: [{ to: '/components/components', label: 'Interactive Playground' }]
  },
  {
    title: 'Support',
    links: [{ to: '/components/support', label: 'GitHub' }]
  }
]
</script>

<template>
  <aside class="ui-surface px-4 py-6">
    <p class="px-2 text-xs font-semibold uppercase tracking-[0.16em] ui-text-muted">
      Documentation
    </p>

    <nav class="mt-4 space-y-5">
      <section
        v-for="section in sections"
        :key="section.title"
      >
        <p class="px-2 text-sm font-semibold">
          {{ section.title }}
        </p>
        <div class="mt-1 space-y-1">
          <router-link
            v-for="item in section.links"
            :key="item.to"
            :to="item.to"
            class="block rounded-md border border-transparent px-3 py-2 text-sm font-medium ui-text-muted transition-colors hover:bg-(--ui-surface-soft) hover:text-(--ui-text)"
            active-class="ui-primary-soft ui-primary border-(--ui-primary)"
          >
            {{ item.label }}
          </router-link>
        </div>
      </section>
    </nav>
  </aside>
</template>
