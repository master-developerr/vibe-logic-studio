import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Chip } from "@/components/ui/chip"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

export default function DesignSystemPage() {
  return (
    <div className="shell py-12 space-y-12">
      <div className="space-y-4">
        <h1 className="h1">VibeLogic Studio Design System</h1>
        <p className="body-large text-[var(--color-text-secondary)]">
          A showcase of the implemented design system components and variables.
        </p>
      </div>

      <section className="space-y-6">
        <h2 className="h2 border-b pb-2">Typography</h2>
        <div className="space-y-4">
          <div className="display">Display (56px)</div>
          <div className="h1">H1 Heading (40px)</div>
          <div className="h2">H2 Heading (32px)</div>
          <div className="h3">H3 Heading (24px)</div>
          <div className="h4">H4 Heading (16px)</div>
          <div className="body-large">Body Large: The quick brown fox jumps over the lazy dog.</div>
          <div className="body-medium">Body Medium: The quick brown fox jumps over the lazy dog.</div>
          <div className="body-small">Body Small: The quick brown fox jumps over the lazy dog.</div>
          <div className="caption text-[var(--color-text-muted)]">Caption text (12px)</div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="h2 border-b pb-2">Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2"><div className="h-16 rounded-md bg-[var(--color-primary)]"></div><p className="caption font-semibold">Primary</p></div>
          <div className="space-y-2"><div className="h-16 rounded-md bg-[var(--color-secondary)]"></div><p className="caption font-semibold">Secondary</p></div>
          <div className="space-y-2"><div className="h-16 rounded-md bg-[var(--color-background)] border"></div><p className="caption font-semibold">Background</p></div>
          <div className="space-y-2"><div className="h-16 rounded-md bg-[var(--color-surface)] border"></div><p className="caption font-semibold">Surface</p></div>
          
          <div className="space-y-2"><div className="h-16 rounded-md bg-[var(--color-success)]"></div><p className="caption font-semibold">Success</p></div>
          <div className="space-y-2"><div className="h-16 rounded-md bg-[var(--color-warning)]"></div><p className="caption font-semibold">Warning</p></div>
          <div className="space-y-2"><div className="h-16 rounded-md bg-[var(--color-error)]"></div><p className="caption font-semibold">Error</p></div>
          <div className="space-y-2"><div className="h-16 rounded-md bg-[var(--color-info)]"></div><p className="caption font-semibold">Info</p></div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="h2 border-b pb-2">Buttons</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
        <div className="flex flex-wrap gap-4 items-end pt-4">
          <Button size="sm">Small</Button>
          <Button size="default">Medium (Default)</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="h2 border-b pb-2">Inputs</h2>
        <div className="grid max-w-sm gap-4">
          <Input placeholder="Default input" />
          <Input placeholder="Success input" success />
          <Input placeholder="Error input" error />
          <Input placeholder="Disabled input" disabled />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="h2 border-b pb-2">Chips & Tags</h2>
        <div className="flex flex-wrap gap-4">
          <Chip variant="category">AI</Chip>
          <Chip variant="category">Automation</Chip>
          
          <Chip variant="statusActive">Active</Chip>
          <Chip variant="statusInProgress">In Progress</Chip>
          <Chip variant="statusCompleted">Completed</Chip>
          <Chip variant="statusCancelled">Cancelled</Chip>

          <Chip variant="filterActive">All</Chip>
          <Chip variant="filterInactive">Popular</Chip>
          
          <Chip variant="badge">New</Chip>
          
          <Chip variant="tag">React</Chip>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="h2 border-b pb-2">Cards</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Automation</CardTitle>
              <CardDescription>Build intelligent workflows and automate your development process with AI.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-24 rounded-md bg-[var(--color-background)] border flex items-center justify-center text-[var(--color-text-muted)] caption">
                Card Content Area
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Learn more</Button>
              <Button>Get started</Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  )
}
