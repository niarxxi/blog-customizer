import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import {
	fontFamilyOptions,
	fontSizeOptions,
	ArticleStateType,
	defaultArticleState,
	fontColors,
	backgroundColors,
	contentWidthArr,
	OptionType,
} from 'src/constants/articleProps';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';

import styles from './ArticleParamsForm.module.scss';

interface ArticleParamsFormProps {
	applyConfig: (data: ArticleStateType) => void;
}

const useOutsideClick = (callback: () => void) => {
	const ref = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				callback();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [callback]);

	return ref;
};

export const ArticleParamsForm: React.FC<ArticleParamsFormProps> = ({
	applyConfig,
}) => {
	const [isPanelVisible, setIsPanelVisible] = useState(false);
	const [styleConfig, setStyleConfig] =
		useState<ArticleStateType>(defaultArticleState);

	const togglePanel = useCallback(() => setIsPanelVisible((prev) => !prev), []);
	const closePanel = useCallback(() => setIsPanelVisible(false), []);

	const panelRef = useOutsideClick(closePanel);

	const submitConfig = useCallback(
		(evt: React.FormEvent) => {
			evt.preventDefault();
			applyConfig(styleConfig);
		},
		[applyConfig, styleConfig]
	);

	const resetToDefaultOption = useCallback(() => {
		setStyleConfig(defaultArticleState);
		applyConfig(defaultArticleState);
	}, [applyConfig]);

	const updateStyleConfig = useCallback(
		(key: keyof ArticleStateType, value: OptionType) => {
			setStyleConfig((prev) => ({ ...prev, [key]: value }));
		},
		[]
	);

	return (
		<>
			<ArrowButton isOpen={isPanelVisible} onClick={togglePanel} />
			<aside
				ref={panelRef}
				className={clsx(styles.container, {
					[styles.container_open]: isPanelVisible,
				})}>
				<form className={styles.form} onSubmit={submitConfig}>
					<Text as='h2' size={31} weight={800} uppercase>
						Задайте параметры
					</Text>
					<Select
						options={fontFamilyOptions}
						selected={styleConfig.fontFamilyOption}
						title='Шрифт'
						onChange={(option) => updateStyleConfig('fontFamilyOption', option)}
					/>
					<RadioGroup
						options={fontSizeOptions}
						selected={styleConfig.fontSizeOption}
						title='Размер шрифта'
						name='Размер шрифта'
						onChange={(option) => updateStyleConfig('fontSizeOption', option)}
					/>
					<Select
						options={fontColors}
						selected={styleConfig.fontColor}
						title='Цвет шрифта'
						onChange={(option) => updateStyleConfig('fontColor', option)}
					/>
					<Separator />
					<Select
						options={backgroundColors}
						selected={styleConfig.backgroundColor}
						title='Цвет фона'
						onChange={(option) => updateStyleConfig('backgroundColor', option)}
					/>
					<Select
						options={contentWidthArr}
						selected={styleConfig.contentWidth}
						title='Ширина контента'
						onChange={(option) => updateStyleConfig('contentWidth', option)}
					/>
					<div className={styles.bottomContainer}>
						<Button
							title='Сбросить'
							htmlType='reset'
							type='clear'
							onClick={resetToDefaultOption}
						/>
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
