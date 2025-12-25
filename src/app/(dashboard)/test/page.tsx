'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export default function TestPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Figma Design Test</h1>
        <p className="text-slate-600 mt-1">Proof of concept - Figma to Next.js conversion</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-slate-900">Builder.io Figma Import</h2>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 mb-4">
            To import Figma designs, run this command in your terminal:
          </p>
          <pre className="bg-slate-100 p-4 rounded-lg text-sm text-slate-800 overflow-x-auto">
            npx &quot;@builder.io/dev-tools@latest&quot; code --url &quot;vcp://quickcopy/vcp-d981ccdc0d9a4f7899d61128102105ed&quot;
          </pre>
          <p className="text-slate-600 mt-4">
            This will authenticate with Builder.io and generate React components from your Figma designs.
          </p>
          <p className="text-slate-600 mt-2">
            Once generated, the components will appear in this project and can be imported here.
          </p>
        </CardContent>
      </Card>

      {/* Placeholder for Figma components */}
      <div className="mt-8 grid gap-6">
        <Card className="border-dashed border-2 border-slate-300">
          <CardContent className="py-12 text-center">
            <p className="text-slate-500">Figma Component 1 will appear here</p>
          </CardContent>
        </Card>
        <Card className="border-dashed border-2 border-slate-300">
          <CardContent className="py-12 text-center">
            <p className="text-slate-500">Figma Component 2 will appear here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
