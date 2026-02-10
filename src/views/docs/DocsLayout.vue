<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Input from '../../components/Input.vue'
import DocsSidebar from './DocsSidebar.vue'

const packageVersion = '3.27.13'
const githubUrl = 'https://github.com/James-Kabz/vue_atomic_ui'

const route = useRoute()
const router = useRouter()
const headerSearch = ref((route.query.q || '').toString())

watch(
  () => route.query.q,
  (value) => {
    headerSearch.value = (value || '').toString()
  }
)

const goToComponentsWithSearch = () => {
  const query = headerSearch.value.trim()
  router.push({
    path: '/components/components',
    query: query ? { q: query } : {}
  })
}

const handleSearchKeydown = (event) => {
  if (event.key === 'Enter') {
    goToComponentsWithSearch()
  }
}
</script>

<template>
  <div class="w-full docs-shell">
    <header class="sticky top-0 z-50 border-b ui-border-strong bg-[color:color-mix(in oklab, var(--ui-surface), transparent 8%)] backdrop-blur-md">
      <div class="mx-auto flex h-16 w-full max-w-[1700px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg docs-brand-chip text-sm font-bold text-white">
            UI
          </div>
          <div>
            <p class="text-sm font-semibold">
              STL Horizon Vue UI
            </p>
            <p class="text-xs ui-text-muted">
              Documentation
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <div class="hidden w-72 lg:block">
            <Input
              v-model="headerSearch"
              placeholder="Search"
              clearable
              @keydown="handleSearchKeydown"
            />
          </div>
          <a
            :href="githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-md border ui-border-strong px-3 py-1.5 text-xs font-medium hover:bg-(--ui-surface-soft)"
          >
            GitHub
          </a>
          <span class="rounded-md border ui-border-strong px-3 py-1.5 text-xs font-semibold ui-text-muted">
            v{{ packageVersion }}
          </span>
        </div>
      </div>
    </header>

    <div class="mx-auto w-full max-w-8xl docs-frame">
      <aside class="docs-sidebar-col">
        <div class="docs-sidebar-scroll">
          <DocsSidebar />
        </div>
      </aside>

      <main class="min-w-0 px-4 py-6 sm:px-6 lg:px-10">
        <section class="mx-auto w-full max-w-full">
          <RouterView />
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.docs-brand-chip {
  background: linear-gradient(135deg, #156df9 0%, #00a7ff 100%);
}

.docs-shell {
  background:
    radial-gradient(circle at 8% -4%, color-mix(in oklab, var(--ui-primary), transparent 88%) 0%, transparent 45%),
    radial-gradient(circle at 100% 0%, color-mix(in oklab, var(--ui-accent), transparent 92%) 0%, transparent 40%),
    var(--ui-bg);
}

.docs-frame {
  display: grid;
  grid-template-columns: 270px minmax(0, 1fr);
}

.docs-sidebar-col {
  border-right: 1px solid var(--ui-border-strong);
}

.docs-sidebar-scroll {
  position: sticky;
  top: 4rem;
  height: calc(100vh - 4rem);
  overflow-y: auto;
}
</style>
