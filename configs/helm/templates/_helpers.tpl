{{/*
Expand the name of the chart.
*/}}
{{- define "graph-kubernetes.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "graph-kubernetes.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "graph-kubernetes.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "graph-kubernetes.labels" -}}
helm.sh/chart: {{ include "graph-kubernetes.chart" . }}
{{ include "graph-kubernetes.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "graph-kubernetes.selectorLabels" -}}
app.kubernetes.io/name: {{ include "graph-kubernetes.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "graph-kubernetes.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "graph-kubernetes.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Define the graph-kubernetes.namespace template if set with forceNamespace or .Release.Namespace is set
https://github.com/prometheus-community/helm-charts/blob/main/charts/prometheus/templates/_helpers.tpl
*/}}
{{- define "graph-kubernetes.namespace" -}}
{{- if .Values.forceNamespace -}}
{{ printf "namespace: %s" .Values.forceNamespace }}
{{- else -}}
{{ printf "namespace: %s" .Release.Namespace }}
{{- end -}}
{{- end -}}

{{/*
Return the appropriate apiVersion for rbac.
*/}}
{{- define "rbac.apiVersion" -}}
{{- if .Capabilities.APIVersions.Has "rbac.authorization.k8s.io/v1" }}
{{- print "rbac.authorization.k8s.io/v1" -}}
{{- else -}}
{{- print "rbac.authorization.k8s.io/v1beta1" -}}
{{- end -}}
{{- end -}}

{{/*
Return the appropriate apiVersion for cronjob.
*/}}
{{- define "cronjob.apiVersion" -}}
{{- if .Capabilities.APIVersions.Has "batch/v1" }}
{{- print "batch/v1" -}}
{{- else -}}
{{- print "batch/v1beta1" -}}
{{- end -}}
{{- end -}}
