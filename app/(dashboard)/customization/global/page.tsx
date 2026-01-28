"use client"
import { StarIcons } from "@/app/(landing)/components/star-icon";
import { FontSelect, type DesignSystemFont } from "@/components/custom-ui/font-select";
import { ImageInput } from "@/components/custom-ui/image-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import InputColor from "@/components/ui/input-color";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Typography from "@/components/ui/typography";
import { deleteOne, getAll, post } from "@/lib/fetch";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Info } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export type CornerRoundness = "none" | "sm" | "md" | "lg" | "rounded";

const BRAND_SETTINGS_QUERY_KEY = ["brand-settings"] as const;

async function fetchBrandSettings(): Promise<{ brandLogoUrl: string | null }> {
  return getAll<{ brandLogoUrl: string | null }>("brand/settings");
}

const borderRadius = {
  none: "0",
  sm: "4px",
  md: "8px",
  lg: "12px",
  rounded: "50px",
}
const GlobalStylesPage = () => {
  const queryClient = useQueryClient();

  const { data: brandSettings } = useQuery({
    queryKey: BRAND_SETTINGS_QUERY_KEY,
    queryFn: fetchBrandSettings,
  });

  const [font, setFont] = useState<DesignSystemFont>("inter");
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [buttonBgColor, setButtonBgColor] = useState("#000");
  const [buttonTextColor, setButtonTextColor] = useState("#fff");
  const [buttonCornerRoundness, setButtonCornerRoundness] = useState<CornerRoundness>("md");
  const [cornerRoundness, setCornerRoundness] = useState<CornerRoundness>("md");
  const [bgColor, setBgColor] = useState("#FFF");
  const [borderColor, setBorderColor] = useState("#000");
  const [textColor, setTextColor] = useState("#000");
  const [starsColor, setStarsColor] = useState("#ffd230");

  const effectiveLogoUrl = logoPreviewUrl ?? brandSettings?.brandLogoUrl ?? null;

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.set("file", file);
      return post("brand/upload-logo", formData, true);
    },
    onSuccess: (data) => {
      setLogoPreviewUrl((prev) => {
        if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
        return data.url;
      });
      queryClient.setQueryData(BRAND_SETTINGS_QUERY_KEY, { brandLogoUrl: data.url });
      toast.success("Logo mis à jour");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteOne("brand/logo", ""),
    onSuccess: () => {
      setLogoPreviewUrl((prev) => {
        if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
        return null;
      });
      queryClient.invalidateQueries({ queryKey: BRAND_SETTINGS_QUERY_KEY });
      toast.success("Logo supprimé");
    },
  });

  const handleLogoPreviewChange = useCallback((url: string) => {
    setLogoPreviewUrl((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return url || null;
    });
  }, []);


  useEffect(() => {
    return () => {
      if (logoPreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(logoPreviewUrl);
    };
  }, [logoPreviewUrl]);

  return (
    <div className="flex gap-5">
      <Card >
        <CardContent className="space-y-6">
          <section className="flex items-start gap-6">
            <div className="space-y-3">
              <Typography variant="h4">Brand Logo</Typography>
              <ImageInput
                variant="logo"
                previewClassName="w-40 h-24"
                defaultPreviewUrl={effectiveLogoUrl}
                onPreviewChange={handleLogoPreviewChange}
                onFileSelect={(file) => uploadMutation.mutate(file)}
                onClear={() => deleteMutation.mutate()}
              />
            </div>
            <div className="space-y-3">
              <Typography variant="h4">Font</Typography>
              <FontSelect value={font} onValueChange={setFont} />
            </div>
          </section>

          <div className="space-y-2">
            <Typography variant="p">Corner roundness</Typography>
            <ToggleGroup type="single" value={cornerRoundness} onValueChange={(v) => setCornerRoundness(v as CornerRoundness)} variant="outline">
              <ToggleGroupItem value="none" aria-label="Toggle top">
                none
              </ToggleGroupItem>
              <ToggleGroupItem value="sm" aria-label="Toggle bottom">
                small
              </ToggleGroupItem>
              <ToggleGroupItem value="md" aria-label="Toggle left">
                medium
              </ToggleGroupItem>
              <ToggleGroupItem value="lg" aria-label="Toggle right">
                large
              </ToggleGroupItem>
              <ToggleGroupItem value="rounded" aria-label="Toggle right">
                rounded
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div>
            <Typography variant="h4">Colors</Typography>
            <section className="flex items-center gap-6">
              <div>
                <InputColor alpha value={bgColor} onChange={setBgColor} onBlur={() => { }} label="Background Color" />
                <InputColor alpha value={borderColor} onChange={setBorderColor} onBlur={() => { }} label="Border Color" />
              </div>
              <div>
                <InputColor alpha value={textColor} onChange={setTextColor} onBlur={() => { }} label="Text Color" />
                <InputColor alpha value={starsColor} onChange={setStarsColor} onBlur={() => { }} label="Stars Color" />
              </div>
            </section>
          </div>
          <div >
            <Typography variant="h4">Buttons</Typography>
            <div className="flex  items-end gap-6 mb-5">
              <InputColor alpha value={buttonBgColor} onChange={setButtonBgColor} onBlur={() => { }} label="Background Color" />
              <InputColor alpha value={buttonTextColor} onChange={setButtonTextColor} onBlur={() => { }} label="Text Color" />
            </div>
            <div className="space-y-2">
              <Typography variant="p">Button corner roundness</Typography>
              <ToggleGroup type="single" value={buttonCornerRoundness} onValueChange={(v) => setButtonCornerRoundness(v as CornerRoundness)} variant="outline">
                <ToggleGroupItem value="none" aria-label="Toggle top">
                  none
                </ToggleGroupItem>
                <ToggleGroupItem value="sm" aria-label="Toggle bottom">
                  small
                </ToggleGroupItem>
                <ToggleGroupItem value="md" aria-label="Toggle left">
                  medium
                </ToggleGroupItem>
                <ToggleGroupItem value="lg" aria-label="Toggle right">
                  large
                </ToggleGroupItem>
                <ToggleGroupItem value="rounded" aria-label="Toggle right">
                  rounded
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
          <Button >Valider les changements</Button>
        </CardContent>
      </Card >
      <div className="flex flex-1">
        <Card className="p-0 ">
          <CardContent className={cn("w-[375px] h-full border m-2 text-primary-foreground rounded-md py-20  gap-4")} style={{ backgroundColor: bgColor, color: textColor, fontFamily: font }}>
            <div className="flex items-center justify-center mb-15">
              {effectiveLogoUrl ? (
                <Image src={effectiveLogoUrl} alt="" className="max-h-16 w-auto object-contain" width={100} height={100} unoptimized />
              ) : (
                <div className="max-h-16 flex items-center justify-center text-muted-foreground text-sm">Aucun logo</div>
              )}
            </div>
            <div className="space-y-2 mb-10">
              <Typography variant="h2" className="text-2xl mb-2" style={{ fontFamily: font }}>Comment noteriez vous votre expérience ?</Typography>
              <StarIcons starsCount={5} starsFilled={3} size={40} color={starsColor} />
              <Typography variant="description" className="flex items-center gap-2"><Info size={18} />Lorem ipsum dollores dollores dollores</Typography>
            </div>

            <FieldGroup className="space-y-2 my-5">
              <Field>
                <FieldLabel>
                  Donnez un titre à votre avis
                </FieldLabel>
                <Input placeholder="Titre" style={{ borderRadius: borderRadius[cornerRoundness], borderColor: borderColor }} />
              </Field>
              <Field>
                <FieldLabel>
                  Laissez un commentaire
                </FieldLabel>
                <Textarea placeholder="Commentaire" className="resize-none min-h-24" style={{ borderRadius: borderRadius[cornerRoundness], borderColor: borderColor }} />
              </Field>
            </FieldGroup>
            <Button className="w-full" style={{ backgroundColor: buttonBgColor, color: buttonTextColor, borderRadius: borderRadius[buttonCornerRoundness] }}>Envoyer mon retour</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GlobalStylesPage;