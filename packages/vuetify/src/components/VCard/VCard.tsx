/* eslint-disable complexity */

// Styles
import './VCard.sass'

// Components
import { VCardActions } from './VCardActions'
import { VCardItem } from './VCardItem'
import { VCardText } from './VCardText'
import { VDefaultsProvider } from '@/components/VDefaultsProvider'
import { VImg } from '@/components/VImg'

// Directives
import { Ripple } from '@/directives/ripple'

// Composables
import { genOverlays, makeVariantProps, useVariant } from '@/composables/variant'
import { IconValue } from '@/composables/icons'
import { LoaderSlot, makeLoaderProps, useLoader } from '@/composables/loader'
import { makeBorderProps, useBorder } from '@/composables/border'
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeDimensionProps, useDimension } from '@/composables/dimensions'
import { makeElevationProps, useElevation } from '@/composables/elevation'
import { makeLocationProps, useLocation } from '@/composables/location'
import { makePositionProps, usePosition } from '@/composables/position'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeRouterProps, useLink } from '@/composables/router'
import { makeTagProps } from '@/composables/tag'
import { makeThemeProps, provideTheme } from '@/composables/theme'

// Utilities
import { computed } from 'vue'
import { genericComponent, useRender } from '@/util'

// Types
import type { MakeSlots } from '@/util'
import type { LoaderSlotProps } from '@/composables/loader'

export type VCardSlots = MakeSlots<{
  default: []
  actions: []
  title: []
  subtitle: []
  text: []
  loader: [LoaderSlotProps]
  image: []
  prepend: []
  append: []
}>

export const VCard = genericComponent<VCardSlots>()({
  name: 'VCard',

  directives: { Ripple },

  props: {
    appendAvatar: String,
    appendIcon: IconValue,
    disabled: Boolean,
    flat: Boolean,
    hover: Boolean,
    image: String,
    link: {
      type: Boolean,
      default: undefined,
    },
    prependAvatar: String,
    prependIcon: IconValue,
    ripple: {
      type: Boolean,
      default: true,
    },
    subtitle: String,
    text: String,
    title: String,

    ...makeThemeProps(),
    ...makeBorderProps(),
    ...makeDensityProps(),
    ...makeDimensionProps(),
    ...makeElevationProps(),
    ...makeLoaderProps(),
    ...makeLocationProps(),
    ...makePositionProps(),
    ...makeRoundedProps(),
    ...makeRouterProps(),
    ...makeTagProps(),
    ...makeVariantProps({ variant: 'elevated' } as const),
  },

  setup (props, { attrs, slots }) {
    const { themeClasses } = provideTheme(props)
    const { borderClasses } = useBorder(props)
    const { colorClasses, colorStyles, variantClasses } = useVariant(props)
    const { densityClasses } = useDensity(props)
    const { dimensionStyles } = useDimension(props)
    const { elevationClasses } = useElevation(props)
    const { loaderClasses } = useLoader(props)
    const { locationStyles } = useLocation(props)
    const { positionClasses } = usePosition(props)
    const { roundedClasses } = useRounded(props)
    const link = useLink(props, attrs)

    const isLink = computed(() => props.link !== false && link.isLink.value)
    const isClickable = computed(() =>
      !props.disabled &&
      props.link !== false &&
      (props.link || link.isClickable.value)
    )

    useRender(() => {
      const Tag = isLink.value ? 'a' : props.tag
      const hasTitle = !!(slots.title || props.title)
      const hasSubtitle = !!(slots.subtitle || props.subtitle)
      const hasHeader = hasTitle || hasSubtitle
      const hasAppend = !!(slots.append || props.appendAvatar || props.appendIcon)
      const hasPrepend = !!(slots.prepend || props.prependAvatar || props.prependIcon)
      const hasImage = !!(slots.image || props.image)
      const hasCardItem = hasHeader || hasPrepend || hasAppend
      const hasText = !!(slots.text || props.text)

      return (
        <Tag
          class={[
            'v-card',
            {
              'v-card--disabled': props.disabled,
              'v-card--flat': props.flat,
              'v-card--hover': props.hover && !(props.disabled || props.flat),
              'v-card--link': isClickable.value,
            },
            themeClasses.value,
            borderClasses.value,
            colorClasses.value,
            densityClasses.value,
            elevationClasses.value,
            loaderClasses.value,
            positionClasses.value,
            roundedClasses.value,
            variantClasses.value,
          ]}
          style={[
            colorStyles.value,
            dimensionStyles.value,
            locationStyles.value,
          ]}
          href={ link.href.value }
          onClick={ isClickable.value && link.navigate }
          v-ripple={ isClickable.value && props.ripple }
          tabindex={ props.disabled ? -1 : undefined }
        >
          { hasImage && (
            <div key="image" class="v-card__image">
              { !slots.image ? (
                <VImg
                  key="image-img"
                  cover
                  src={ props.image }
                />
              ) : (
                <VDefaultsProvider
                  key="image-defaults"
                  disabled={ !props.image }
                  defaults={{
                    VImg: {
                      cover: true,
                      src: props.image,
                    },
                  }}
                  v-slots:default={ slots.image }
                />
              )}
            </div>
          )}

          <LoaderSlot
            name="v-card"
            active={ !!props.loading }
            color={ typeof props.loading === 'boolean' ? undefined : props.loading }
            v-slots={{ default: slots.loader }}
          />

          { hasCardItem && (
            <VCardItem
              key="item"
              prependAvatar={ props.prependAvatar }
              prependIcon={ props.prependIcon }
              title={ props.title }
              subtitle={ props.subtitle }
              appendAvatar={ props.appendAvatar }
              appendIcon={ props.appendIcon }
            >
              {{
                default: slots.item,
                prepend: slots.prepend,
                title: slots.title,
                subtitle: slots.subtitle,
                append: slots.append,
              }}
            </VCardItem>
          )}

          { hasText && (
            <VCardText key="text">
              { slots.text?.() ?? props.text }
            </VCardText>
          )}

          { slots.default?.() }

          { slots.actions && (
            <VCardActions v-slots={{ default: slots.actions }} />
          )}

          { genOverlays(isClickable.value, 'v-card') }
        </Tag>
      )
    })

    return {}
  },
})

export type VCard = InstanceType<typeof VCard>
